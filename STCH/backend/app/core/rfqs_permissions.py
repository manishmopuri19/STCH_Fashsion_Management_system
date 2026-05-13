# from fastapi import HTTPException
# from sqlalchemy.orm import Session

# from app.models.rfq_model import RFQ
# from app.models.rfq_collaborator_model import RFQCollaborator

# def validate_rfq_access(rfq_id: int,current_user,db: Session):

#     rfq = db.query(RFQ).filter(
#         RFQ.id == rfq_id
#     ).first()

#     if not rfq:
#         raise HTTPException(
#             status_code=404,
#             detail="RFQ not found"
#         )

#     # ADMIN ACCESS
#     if current_user.role.name == "ADMIN":
#         return rfq

#     # OWNER ACCESS
#     if rfq.owner_id == current_user.id:
#         return rfq

#     # COLLABORATOR ACCESS
#     collaborator = db.query(
#         RFQCollaborator
#     ).filter(
#         RFQCollaborator.rfq_id == rfq_id,
#         RFQCollaborator.user_id == current_user.id
#     ).first()

#     if collaborator:
#         return rfq

#     raise HTTPException(
#         status_code=403,
#         detail="RFQ access denied"
#     )