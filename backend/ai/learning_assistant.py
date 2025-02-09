from .base_agent import BaseAgent
from backend.model import Course, CourseContent, Assignment
from flask import current_app

class LearningAssistant(BaseAgent):
    """AI Learning Assistant for students"""
    
    def __init__(self):
        system_prompt = """You are an AI Learning Assistant for the SEEK portal. Your role is to:
        1. Guide students to relevant course materials without providing direct answers
        2. Suggest learning strategies and study techniques
        3. Help break down complex topics into understandable parts
        4. Maintain academic integrity by not solving assignments
        5. Provide explanations that encourage understanding rather than memorization
        
        Remember:
        - Never provide direct solutions to assignments
        - Always encourage critical thinking
        - Suggest relevant course materials and resources
        - Focus on explaining concepts and approaches
        """
        super().__init__(system_prompt)
    
    def get_course_context(self, course_id, user_id):
        """Get relevant course context for the student"""
        try:
            course = Course.query.get(course_id)
            if not course:
                return None
            
            # Get course content
            content = CourseContent.query.filter_by(course_id=course_id).all()
            content_text = "\n".join([f"Lecture {c.lecture_no}: {c.lecture_url}" for c in content])
            
            # Get assignments
            assignments = Assignment.query.filter_by(course_id=course_id).all()
            assignment_text = "\n".join([f"Assignment: {a.title}" for a in assignments])
            
            return f"""
            Course: {course.course_name}
            
            Available Content:
            {content_text}
            
            Current Assignments:
            {assignment_text}
            """
        except Exception as e:
            current_app.logger.error(f"Error getting course context: {str(e)}")
            return None
    
    def answer_question(self, question, course_id, user_id):
        """Answer a student's question with course context"""
        try:
            context = self.get_course_context(course_id, user_id)
            if not context:
                return {"status": "error", "message": "Could not get course context"}
                
            return self.get_response(question, context)
        except Exception as e:
            current_app.logger.error(f"Error in answer_question: {str(e)}")
            return {"status": "error", "message": str(e)} 