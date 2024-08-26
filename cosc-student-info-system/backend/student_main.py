from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import List

# Database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./studentdata.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI instance
app = FastAPI()

# CORS configuration
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database model
class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    roll_number = Column(String, unique=True, index=True)
    age = Column(Integer)
    department = Column(String)
    semester = Column(Integer)
    class_name = Column(String)
    cgpa = Column(Float)
    attendance = Column(Float)
    fee_paid = Column(Float)

Base.metadata.create_all(bind=engine)

# Pydantic models
class StudentBase(BaseModel):
    name: str
    roll_number: str
    age: int
    department: str
    semester: int
    class_name: str
    cgpa: float
    attendance: float
    fee_paid: float

class StudentCreate(StudentBase):
    pass

class StudentResponse(StudentBase):
    id: int
    fee_unpaid: float

    class Config:
        orm_mode = True

# Create Student
@app.post("/students/", response_model=StudentResponse)
def create_student(student: StudentCreate):
    db = SessionLocal()
    db_student = Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    response = StudentResponse(**db_student.__dict__)
    response.fee_unpaid = 100000 - db_student.fee_paid
    db.close()
    return response

# Read all Students
@app.get("/students/", response_model=List[StudentResponse])
def read_students():
    db = SessionLocal()
    students = db.query(Student).all()
    response = [StudentResponse(**student.__dict__, fee_unpaid=100000 - student.fee_paid) for student in students]
    db.close()
    return response

# Read Student by ID
@app.get("/students/{student_id}", response_model=StudentResponse)
def read_student(student_id: int):
    db = SessionLocal()
    student = db.query(Student).filter(Student.id == student_id).first()
    db.close()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    response = StudentResponse(**student.__dict__)
    response.fee_unpaid = 100000 - student.fee_paid
    return response

# Update Student
@app.put("/students/{student_id}", response_model=StudentResponse)
def update_student(student_id: int, student: StudentCreate):
    db = SessionLocal()
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if db_student is None:
        db.close()
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in student.dict().items():
        setattr(db_student, key, value)
    db.commit()
    db.refresh(db_student)
    response = StudentResponse(**db_student.__dict__)
    response.fee_unpaid = 100000 - db_student.fee_paid
    db.close()
    return response

# Delete Student
@app.delete("/students/{student_id}", response_model=StudentResponse)
def delete_student(student_id: int):
    db = SessionLocal()
    db_student = db.query(Student).filter(Student.id == student_id).first()
    if db_student is None:
        db.close()
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
    response = StudentResponse(**db_student.__dict__)
    response.fee_unpaid = 100000 - db_student.fee_paid
    db.close()
    return response

# Root endpoint for testing
@app.get("/")
def read_root():
    return {"message": "Welcome to the Student API"}