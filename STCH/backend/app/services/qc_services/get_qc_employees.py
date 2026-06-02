from datetime import date
from sqlalchemy.orm import Session
from app.models.user_model import User
from app.models.Tna_model import TNA
from app.enums.user_enums import UserRole
from app.enums.TNAStatus_enums import TNAStatus


def get_qc_employees_service(db: Session):
    today = date.today()
    employees = db.query(User).filter(User.role == UserRole.QC).all()

    result = []
    for emp in employees:
        tnas = db.query(TNA).filter(TNA.assigned_to == emp.id).all()
        total = len(tnas)
        completed = sum(1 for t in tnas if t.status == TNAStatus.COMPLETED)
        in_progress = sum(1 for t in tnas if t.status == TNAStatus.IN_PROGRESS)
        pending = sum(1 for t in tnas if t.status == TNAStatus.PENDING)
        overdue = sum(
            1 for t in tnas
            if t.planned_date
            and t.planned_date < today
            and t.status not in [TNAStatus.COMPLETED, TNAStatus.CANCELLED]
        )

        result.append({
            "id": emp.id,
            "userName": emp.userName,
            "email": emp.email,
            "role": emp.role.value,
            "stats": {
                "total": total,
                "completed": completed,
                "in_progress": in_progress,
                "pending": pending,
                "overdue": overdue,
            },
        })

    return result
