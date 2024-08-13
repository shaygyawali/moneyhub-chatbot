# MoneyHub ChatBot

## Overview

### Backend
This project leverages Pinecone, Cohere, and OpenAI to create a sophisticated data processing and retrieval system. The following instructions will guide you through setting up the necessary environment, installing dependencies, and running the project.

### Prerequisites 

Make sure you have Python 3.6+ installed on your system. You’ll also need `pip` to install the required packages. 

#### Installation 
1.  **Clone the Repository:** 
	```
	bash git clone https://github.com/your-repo-name.git cd your-repo-name
	```

2. **Create a `.env` File:**

	In the root of the project directory, create a `.env` file with the 	 following content:
	```
	PINECONE_API_KEY=your-pinecone-api-key
	PINECONE_INDEX_NAME=your-pinecone-index-name
	PINECONE_ENVIRONMENT=your-pinecone-environment
	OPENAI_API_KEY=your-openai-api-key
	COHERE_API_KEY=your-cohere-api-key
	```
	Replace the placeholder values with your actual API keys.
	
3. **Install Dependencies:**

	Run the following command in your terminal to install the necessary packages:
	```
	pip install "pinecone-client[grpc]==3.0.0.dev4" pandas numpy pyarrow python-dotenv tenacity ray beautifulsoup4 fastapi requests langchain_community langserve langchain_cohere openai sse_starlette
	```
4. **Setup API Keys**

	***Pinecone***

   - **Sign up for a Pinecone account** at [Pinecone](https://app.pinecone.io).
   -  **API Key:** Find your API key in the API Keys section.
   -  **Create an Index:** Go to the Indexes section and create an index. The name you give to this index will be used as `PINECONE_INDEX_NAME`.
   - **Environment:** The environment (e.g., `us-east-1`) where your index is hosted will be your `PINECONE_ENVIRONMENT`.

		For more detailed instructions, visit [Pinecone's official documentation](https://pypi.org/project/pinecone-client/).

***Cohere***

- **Sign up for a Cohere account** at [Cohere](https://dashboard.cohere.com/).
-   **API Key:** Your API key can be found in the API Keys section.

## Running the Project

1.  **Run `test.py`:**
    
    This script sets up and prepares the environment.
    
            `python test.py` 
    
2.  **Run `server.py`:**
    
    This script starts the FastAPI server and calls `chain.py` for handling requests.
        
    `python server.py` 
    
    Once the server is running, you can access the API at `http://127.0.0.1:8000`
    

## Additional Notes

This project may require additional dependencies as you work with the code. If you encounter any missing dependencies, install them using `pip` and update this README as needed.