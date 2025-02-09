import os
from phi.agent import Agent
from phi.knowledge.pdf import PDFKnowledgeBase
from phi.vectordb.lancedb import LanceDb, SearchType
from phi.embedder.sentence_transformer import SentenceTransformerEmbedder
from flask import current_app
from phi.model.openrouter import OpenRouter

class StudyPlanner:
    def __init__(self, course_id):
        # Define the lancedb directory path
        self.lancedb_dir = "tmp/lancedb"
        os.makedirs(self.lancedb_dir, exist_ok=True)

        # Initialize knowledge base
        course_dir = f"backend/ai/course_materials/{course_id}"
        if not os.path.exists(course_dir):
            # os.makedirs(course_dir, exist_ok=True)
            raise Exception("Study resources directory not found")

        pdf_files = [f for f in os.listdir(course_dir) if f.endswith('.pdf')]
        if not pdf_files:
            raise Exception("No PDF files found in study resources")

        try:
            # Create knowledge base from local PDFs
            self.knowledge_base = PDFKnowledgeBase(
                path=course_dir,
                vector_db=LanceDb(
                    table_name=f"study_planner_{course_id}",
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
                system_prompt="""You are an AI Study Planner. Your role is to:
                1. Create study plans based on course materials
                2. Suggest optimal learning sequences
                3. Help manage assignment deadlines
                4. Recommend revision strategies
                
                Remember:
                - Reference course materials from the knowledge base
                - Consider assignment deadlines
                - Adapt to student's learning pace
                - Suggest specific resources
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