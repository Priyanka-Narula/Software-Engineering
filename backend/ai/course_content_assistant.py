import os
from phi.agent import Agent
from phi.knowledge.pdf import PDFKnowledgeBase
from phi.vectordb.lancedb import LanceDb, SearchType
from phi.embedder.sentence_transformer import SentenceTransformerEmbedder
from flask import current_app
from phi.model.openrouter import OpenRouter

class CourseContentAssistant:
    def __init__(self, course_id):
        # Define the lancedb directory path
        self.lancedb_dir = "tmp/lancedb"
        os.makedirs(self.lancedb_dir, exist_ok=True)

        # Initialize knowledge base
        course_dir = f"backend/ai/course_materials/{course_id}"
        if not os.path.exists(course_dir):
            os.makedirs(course_dir, exist_ok=True)
            raise Exception("Course materials directory not found")

        pdf_files = [f for f in os.listdir(course_dir) if f.endswith('.pdf')]
        if not pdf_files:
            raise Exception("No PDF files found in course materials")

        try:
            # Create knowledge base from local PDFs
            self.knowledge_base = PDFKnowledgeBase(
                path=course_dir,
                vector_db=LanceDb(
                    table_name=f"course_{course_id}_docs",
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
                    # Increase max tokens for response
                    max_tokens=4096,
                    # temperature=0.7,
                    # Add top_p for better response quality
                    top_p=0.9
                ),
                system_prompt="""You are an AI Course Content Assistant with access to a knowledge base of course materials. Your role is to:
                1. Use the course knowledge base to provide accurate information
                2. Help explain complex concepts using course-specific examples
                3. Guide students to relevant sections in course materials
                4. Generate practice questions based on course content
                5. Create summaries of course materials
                
                Remember:
                - Use maximum 5-6 lines in your response
                - Always reference specific sections from the knowledge base
                - Maintain academic integrity
                - Focus on understanding rather than memorization
                - Provide complete, well-structured responses
                - Break down complex information into digestible parts
                
                Format your responses like this:
                
                ## Summary
                [Brief overview of the response]
                
                ## Details
                [Main content broken into sections]
                
                ## References
                [Relevant sections from course materials]
                """,
                knowledge=self.knowledge_base,
                search_knowledge=True,
                markdown=True
            )

        except Exception as e:
            current_app.logger.error(f"Error initializing knowledge base: {str(e)}")
            raise Exception(f"Failed to initialize knowledge base: {str(e)}")

    def get_response(self, question):
        """Get response from the agent with error handling"""
        try:
            # Format question to encourage complete responses
            formatted_question = f"""
            Please provide a detailed response to the following question. 
            Include relevant examples and references from the course materials.
            Break down complex concepts into understandable parts.
            
            Question: {question}
            """
            
            response = self.agent.run(formatted_question)
            
            # Process and format the response
            formatted_response = response.content if response.content else "No response generated"
            
            return {
                "status": "success",
                "response": formatted_response,
            }
        except Exception as e:
            current_app.logger.error(f"Agent error: {str(e)}")
            return {"status": "error", "message": str(e)} 