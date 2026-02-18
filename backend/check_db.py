from app.core.database import engine, Base
from app.models.user import User
from app.models.roadmap import Roadmap
from app.models.comment import Comment

try:
    print("Attempting to create tables...")
    Base.metadata.create_all(bind=engine)
    print("SUCCESS: Tables created or already exist.")
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()
