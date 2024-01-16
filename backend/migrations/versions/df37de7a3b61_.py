"""empty message

Revision ID: df37de7a3b61
Revises: ff49a0674d0b
Create Date: 2024-01-16 19:28:18.991098

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'df37de7a3b61'
down_revision = 'ff49a0674d0b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('answer', schema=None) as batch_op:
        batch_op.add_column(sa.Column('id', sa.Integer(), nullable=False))
        batch_op.drop_column('answer_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('answer', schema=None) as batch_op:
        batch_op.add_column(sa.Column('answer_id', sa.INTEGER(), autoincrement=False, nullable=False))
        batch_op.drop_column('id')

    # ### end Alembic commands ###
