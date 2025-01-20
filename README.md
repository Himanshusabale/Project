# Project Title: Responsive Webpage with Chat Application and AWS Lambda Integration

---

## **Project Overview**

This project includes a responsive webpage, a Django-based chat application, and AWS Lambda functions for specific tasks.  

---

## **Project Features**

### Frontend:
1. A fixed navbar, collapsible left menu, main content area, and right panel.
2. Responsive design with dynamic resizing based on screen width.
3. Collapsible left menu with smooth transitions.

### Backend:
1. User authentication (signup and login).
2. Chat functionality with WebSocket for real-time communication.
3. Database for user information and chat messages (SQLite by default).

### AWS:
1. Lambda function to add two numbers.
2. Lambda function to store documents in an S3 bucket.

---

## **Installation and Setup**

### Prerequisites:
1. **Python 3.8 or higher**
2. **Django 4.x**
3. **Node.js and npm** (for frontend assets if required)
4. **AWS CLI** (for deploying Lambda functions)
5. **Git** (for version control)
6. **PythonAnywhere** or **AWS Account** (for hosting)

---

### **Frontend Setup**

1. Clone the repository:
    ```bash
    git clone <repository_url>
    cd project/frontend
    ```

2. Open `index.html` in your browser to preview the static frontend.

3. For local development with live reload, you can use an HTTP server:
    ```bash
    python -m http.server
    ```

---

### **Backend Setup**

1. Navigate to the backend folder:
    ```bash
    cd ../backend
    ```

2. Create a virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Apply migrations:
    ```bash
    python manage.py migrate
    ```

5. Create a superuser:
    ```bash
    python manage.py createsuperuser
    ```

6. Run the server:
    ```bash
    python manage.py runserver
    ```

7. Open the application in your browser:
    ```
    http://127.0.0.1:8000/
    ```

---

### **AWS Lambda Setup**

#### Prerequisites:
- **AWS CLI configured** with an IAM user having permissions for Lambda and S3.

#### **1. Deploy the Add Two Numbers Lambda**

1. Navigate to the `aws/add_two_numbers` folder.
2. Create a deployment package:
    ```bash
    zip add_two_numbers.zip lambda_function.py
    ```
3. Deploy the function:
    ```bash
    aws lambda create-function \
      --function-name AddTwoNumbers \
      --runtime python3.8 \
      --role <role_arn> \
      --handler lambda_function.lambda_handler \
      --zip-file fileb://add_two_numbers.zip
    ```

#### **2. Deploy the S3 Upload Lambda**

1. Navigate to the `aws/upload_to_s3` folder.
2. Create a deployment package:
    ```bash
    zip upload_to_s3.zip lambda_function.py
    ```
3. Deploy the function:
    ```bash
    aws lambda create-function \
      --function-name UploadToS3 \
      --runtime python3.8 \
      --role <role_arn> \
      --handler lambda_function.lambda_handler \
      --zip-file fileb://upload_to_s3.zip
    ```

---

### **Hosting Instructions**

#### **PythonAnywhere**:
1. Log in to [PythonAnywhere](https://www.pythonanywhere.com/).
2. Create a new web app and choose **Django** as the framework.
3. Set up the project folder as per the backend directory.
4. Configure static files and database in the web app dashboard.
5. Reload the application to view it online.

#### **AWS Elastic Beanstalk** (Optional):
1. Install the Elastic Beanstalk CLI:
    ```bash
    pip install awsebcli
    ```
2. Initialize the project:
    ```bash
    eb init -p python-3.8 project-name
    ```
3. Deploy the application:
    ```bash
    eb deploy
    ```

---

## **Folder Structure**

project/ ├── frontend/ │ ├── index.html │ ├── style.css │ ├── script.js ├── backend/ │ ├── manage.py │ ├── chat/ │ │ ├── models.py │ │ ├── views.py │ │ ├── templates/ │ │ └── chat.html ├── aws/ │ ├── add_two_numbers/ │ │ └── lambda_function.py │ ├── upload_to_s3/ │ └── lambda_function.py └── README.md
