from pydantic import BaseModel
from typing import Optional, Any
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str
    first_name: str
    last_name: str
    email: str
    location: Optional[str] = None
    phone_number: Optional[str] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    location: Optional[str] = None
    phone_number: Optional[str] = None

class UserResponse(UserBase):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    location: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    
    class Config:
        from_attributes = True

# Workspace Schemas
class WorkspaceBase(BaseModel):
    name: str
    description: Optional[str] = None
    workspace_type: str = "ai_agent"
    graph_data: Optional[str] = "{}"

class WorkspaceCreate(WorkspaceBase):
    pass

class WorkspaceUpdate(WorkspaceBase):
    pass

class WorkspaceResponse(WorkspaceBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
