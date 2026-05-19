from fastapi import HTTPException

from app.models.rfq_model import RFQ

from app.models.rfqCollaborator_model import (
    RFQCollaborator
)

from app.models.rfq_supplier_model import (
    RFQSupplier
)

from app.enums.user_enums import (
    UserRole
)


def can_access_rfq(

    rfq_id,

    current_user,

    db
):

    # ADMIN
    if current_user.role == (
        UserRole.ADMIN
    ):

        return True

    # RFQ EXISTS?
    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id
    ).first()

    if not rfq:

        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    # CREATOR ACCESS
    if rfq.created_by == (
        current_user.id
    ):

        return True

    # COLLABORATOR ACCESS
    collaborator = db.query(
        RFQCollaborator
    ).filter(

        RFQCollaborator.rfq_id
        == rfq_id,

        RFQCollaborator.user_id
        == current_user.id

    ).first()

    if collaborator:

        return True

    # SUPPLIER ACCESS
    supplier_access = db.query(
        RFQSupplier
    ).filter(

        RFQSupplier.rfq_id
        == rfq_id,

        RFQSupplier.supplier_id
        == current_user.id

    ).first()

    if supplier_access:

        return True

    raise HTTPException(
        status_code=403,
        detail="Access denied"
    )