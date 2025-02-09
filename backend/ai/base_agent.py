from phi.agent import Agent
from phi.model.openrouter import OpenRouter
from flask import current_app
import os

class BaseAgent:
    """Base class for all AI agents in the SEEK portal"""
    
    def __init__(self, system_prompt):
        # Initialize agent like the example
        self.agent = Agent(
            model=OpenRouter(id="google/gemini-2.0-flash-lite-preview-02-05:free"),
            system_prompt=system_prompt,
            markdown=True
        )
        
    def get_response(self, prompt, context=None):
        """Get response from the agent with error handling"""
        try:
            if context:
                full_prompt = f"""
                Context:
                {context}

                Question:
                {prompt}
                """
            else:
                full_prompt = prompt
                
            # Get response from agent
            response = self.agent.run(full_prompt)
            # breakpoint()
            # Return the response
            return {
                "status": "success", 
                "response": response.content
            }
        except Exception as e:
            current_app.logger.error(f"Agent error: {str(e)}")
            return {"status": "error", "message": str(e)} 