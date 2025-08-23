#!/usr/bin/env python3
"""
Test script to verify backend API connectivity and functionality
"""
import requests
import json
import sys

API_BASE = "http://localhost:5055"

def test_ping():
    """Test the ping endpoint"""
    try:
        response = requests.get(f"{API_BASE}/api/ping")
        print(f"✅ Ping test: {response.status_code}")
        if response.ok:
            data = response.json()
            print(f"   Response: {data}")
        return response.ok
    except Exception as e:
        print(f"❌ Ping test failed: {e}")
        return False

def test_create_teacher():
    """Test creating a teacher account"""
    try:
        teacher_data = {
            "username": "test_teacher",
            "email": "test_teacher@example.com",
            "password": "password123",
            "role": "teacher"
        }
        response = requests.post(f"{API_BASE}/api/users/register", json=teacher_data)
        print(f"✅ Create teacher test: {response.status_code}")
        if response.ok:
            data = response.json()
            print(f"   Teacher created: {data.get('username')} (ID: {data.get('id')})")
            return data.get('id')
        else:
            print(f"   Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Create teacher test failed: {e}")
        return None

def test_create_classroom(teacher_id):
    """Test creating a classroom"""
    try:
        classroom_data = {
            "name": "Test Classroom",
            "teacherId": teacher_id
        }
        response = requests.post(f"{API_BASE}/api/classrooms", json=classroom_data)
        print(f"✅ Create classroom test: {response.status_code}")
        if response.ok:
            data = response.json()
            print(f"   Classroom created: {data.get('name')} (Code: {data.get('joinCode')})")
            return data
        else:
            print(f"   Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Create classroom test failed: {e}")
        return None

def test_create_student():
    """Test creating a student account"""
    try:
        student_data = {
            "username": "test_student",
            "email": "test_student@example.com",
            "password": "password123",
            "role": "student"
        }
        response = requests.post(f"{API_BASE}/api/users/register", json=student_data)
        print(f"✅ Create student test: {response.status_code}")
        if response.ok:
            data = response.json()
            print(f"   Student created: {data.get('username')} (ID: {data.get('id')})")
            return data.get('id')
        else:
            print(f"   Error: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Create student test failed: {e}")
        return None

def test_join_classroom(classroom_data, student_id):
    """Test joining a classroom"""
    try:
        join_data = {
            "joinCode": classroom_data.get('joinCode'),
            "studentId": student_id
        }
        response = requests.post(f"{API_BASE}/api/classrooms/join", json=join_data)
        print(f"✅ Join classroom test: {response.status_code}")
        if response.ok:
            data = response.json()
            print(f"   Join successful: {data.get('classroom', {}).get('name')}")
            if data.get('teacher'):
                print(f"   Teacher: {data.get('teacher', {}).get('username')}")
            return True
        else:
            print(f"   Error: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Join classroom test failed: {e}")
        return False

def main():
    print("🧪 Testing Backend API Connectivity")
    print("=" * 50)
    
    # Test ping
    if not test_ping():
        print("❌ Backend is not responding. Make sure it's running on port 5055")
        sys.exit(1)
    
    # Test creating teacher
    teacher_id = test_create_teacher()
    if not teacher_id:
        print("❌ Could not create teacher account")
        sys.exit(1)
    
    # Test creating classroom
    classroom_data = test_create_classroom(teacher_id)
    if not classroom_data:
        print("❌ Could not create classroom")
        sys.exit(1)
    
    # Test creating student
    student_id = test_create_student()
    if not student_id:
        print("❌ Could not create student account")
        sys.exit(1)
    
    # Test joining classroom
    if test_join_classroom(classroom_data, student_id):
        print("✅ All tests passed! Backend is working correctly.")
    else:
        print("❌ Join classroom test failed")
        sys.exit(1)

if __name__ == "__main__":
    main()


