import os
from phi.agent import Agent
from phi.knowledge.pdf import PDFKnowledgeBase
from phi.vectordb.lancedb import LanceDb, SearchType
from phi.embedder.sentence_transformer import SentenceTransformerEmbedder
from flask import current_app
from phi.model.openrouter import OpenRouter

class ProgrammingAssistant:
    def __init__(self):
        # Define the lancedb directory path
        self.lancedb_dir = "tmp/lancedb"
        os.makedirs(self.lancedb_dir, exist_ok=True)

        # Initialize knowledge base
        resources_dir = "backend/ai/programming_resources"
        if not os.path.exists(resources_dir):
            os.makedirs(resources_dir, exist_ok=True)
            raise Exception("Programming resources directory not found")

        pdf_files = [f for f in os.listdir(resources_dir) if f.endswith('.pdf')]
        if not pdf_files:
            raise Exception("No programming resources found")

        try:
            # Create knowledge base from local PDFs
            self.knowledge_base = PDFKnowledgeBase(
                path=resources_dir,
                vector_db=LanceDb(
                    table_name="programming_docs",
                    uri=self.lancedb_dir,
                    search_type=SearchType.hybrid,
                    embedder=SentenceTransformerEmbedder(model_name="all-MiniLM-L6-v2"),
                ),
            )

            # Load the knowledge base
            self.knowledge_base.load(recreate=False)

            # Initialize agent with knowledge base
            self.agent = Agent(
                model=OpenRouter(
                    id="google/gemini-2.0-pro-exp-02-05:free",
                    max_tokens=4096,
                    top_p=0.9
                ),
                system_prompt="""You are an AI Programming Assistant. Your role is to:
                1. Use the programming knowledge base to explain concepts
                2. Guide students through problem-solving approaches
                3. Suggest debugging strategies
                4. Explain code patterns and best practices
                
                Remember:
                - Never write complete solutions
                - Focus on teaching programming concepts
                - Use examples from the knowledge base
                - Encourage good coding practices
                - Use maximum 5-6 lines in your response
                """,
                knowledge=self.knowledge_base,
                search_knowledge=True,
                markdown=True
            )

        except Exception as e:
            current_app.logger.error(f"Error initializing knowledge base: {str(e)}")
            raise Exception(f"Failed to initialize knowledge base: {str(e)}")

    def get_response(self, question):
        try:
            response = self.agent.run(question)
            return {
                "status": "success",
                "response": response.content,
            }
        except Exception as e:
            current_app.logger.error(f"Agent error: {str(e)}")
            return {"status": "error", "message": str(e)} 