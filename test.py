import os, json, requests, ray
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOpenAI
from langchain_community.embeddings import CohereEmbeddings
from langchain_community.vectorstores import Pinecone
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from pinecone import Pinecone as PineconeClient
from pinecone.grpc import PineconeGRPC
from pinecone import ServerlessSpec
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from langserve import add_routes

load_dotenv()

ray.init(
    num_cpus=1,  # Limit the number of CPUs
    _memory=200 * 1024 * 1024,  # Limit memory to 200 MB for the worker
    object_store_memory=80 * 1024 * 1024,  # Limit object store memory
    runtime_env={
        "env_vars": {
            "PINECONE_API_KEY": os.getenv("PINECONE_API_KEY"),
        }
    },
)

url = "https://huggingface.co/api/datasets/Cohere/wikipedia-22-12-en-embeddings/parquet/default/train"
response = requests.get(url)
input_files = json.loads(response.content)
columns = ['id', 'title', 'text', 'url', 'emb',] 
ds = ray.data.read_parquet(input_files, columns=columns)

pc = PineconeGRPC()
index_name = 'cohere-medium'

# make sure the index doesn't exist before creating it: 
indexes = pc.list_indexes().indexes
names = [_['name'] for _ in indexes]
if index_name not in names:
    pc.create_index(
        name=index_name,
        dimension=768,
        metric="cosine",
        spec=ServerlessSpec(cloud='aws', region='us-east-1') 
    )

def upload(batch):
    client = PineconeGRPC()
    index = client.Index(index_name)
    total_vectors = 0
    num_failures = 0
    # data = process_data(large_batch).to_dict(orient='records')
    data = batch.to_dict(orient='records')
    
    @retry(stop=stop_after_attempt(2), wait=wait_exponential(multiplier=1, min=4, max=10))
    def send_batch(batch):
        return index.upsert(vectors=batch)
    
    try:
        result = send_batch(data)
        total_vectors += result.upserted_count
    except Exception as e:
        logging.exception(e)
        num_failures += len(data)
    return {'upsreted': np.array([total_vectors]), 'errors': np.array([num_failures])}

class Upserter:
    def __call__(self, large_batch):
        return upload(large_batch)