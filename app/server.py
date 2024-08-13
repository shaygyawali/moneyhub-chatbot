from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from langserve import add_routes
from chain import chain as pinecone_wiki_chain

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],  # This allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # This allows all headers
)



@app.get("/")
async def redirect_root_to_docs():
    return RedirectResponse("/docs")

# Custom POST endpoint to handle queries directly
@app.post("/pinecone-wikipedia/query")
async def pinecone_query(request: Request):
    input_data = await request.json()
    question = input_data.get("question")

    print(question)
    
    if not question:
        return {"error": "Question is required"}
    
    # Assuming pinecone_wiki_chain is set up correctly and handles the processing
    result = pinecone_wiki_chain.invoke(question)
    return {"result": result}

# Automatically add routes for your chain using langserve
add_routes(app, pinecone_wiki_chain, path="/pinecone-wikipedia")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)