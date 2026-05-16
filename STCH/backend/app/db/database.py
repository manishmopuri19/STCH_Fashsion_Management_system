import sqlite3

from sqlalchemy import (
    Engine,
    create_engine,
    event
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False, "timeout": 60},
    pool_pre_ping=True
)

SessionLocal = sessionmaker(

    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    bind=engine
)
@event.listens_for(
    Engine,
    "connect"
)
def set_sqlite_pragma(
    dbapi_connection,
    connection_record
):

    if isinstance(
        dbapi_connection,
        sqlite3.Connection
    ):

        cursor = dbapi_connection.cursor()

        cursor.execute(
            "PRAGMA foreign_keys=ON;"
        )

        cursor.close()
Base = declarative_base()