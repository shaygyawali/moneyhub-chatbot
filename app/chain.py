import os
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOpenAI
#from langchain_community.embeddings import CohereEmbeddings
from langchain_cohere import CohereEmbeddings
from langchain_community.vectorstores import Pinecone
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.pydantic_v1 import BaseModel
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from pinecone import Pinecone as PineconeClient

load_dotenv()

# Keys
PINECONE_API_KEY = os.environ["PINECONE_API_KEY"]
PINECONE_ENVIRONMENT = os.environ["PINECONE_ENVIRONMENT"]
PINECONE_INDEX_NAME = os.environ["PINECONE_INDEX_NAME"]

pinecone = PineconeClient(api_key=PINECONE_API_KEY)

embeddings = CohereEmbeddings(model="multilingual-22-12")
vectorstore = Pinecone.from_existing_index(index_name=PINECONE_INDEX_NAME, embedding=embeddings)

retriever = vectorstore.as_retriever()

def fetch_medium_article(id):
    url = f"https://mfaisal718.medium.com/{id}"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    # Extract the main content
    article_content = soup.find('article')
    if article_content:
        return article_content.get_text(separator="\n")[:32000]
    else:
        return "Content not found"

def fetch_url(x):
    urls = [doc.metadata['url'] for doc in x['context']]
    ids = [url.split('/')[-1] for url in urls] # Assuming the ID is the last part of the URL
    contents = [fetch_medium_article(id) for id in ids]
    return {"context": contents, "question": x["question"]}

# RAG prompt
template = """Answer the question based only on the following context:
{context}
Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)

# RAG
model = ChatOpenAI(model="gpt-3.5-turbo")
chain = (
    RunnableParallel({"context": retriever, "question": RunnablePassthrough()})
    | RunnableLambda(fetch_url)
    | prompt
    | model
    | StrOutputParser()
)