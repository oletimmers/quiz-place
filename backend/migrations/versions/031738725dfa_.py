"""empty message

Revision ID: 031738725dfa
Revises: a8c7029c9ff0
Create Date: 2024-01-16 19:47:46.174929

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '031738725dfa'
down_revision = 'a8c7029c9ff0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('answer', schema=None) as batch_op:
        batch_op.alter_column('answer',
               existing_type=sa.TEXT(),
               nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('answer', schema=None) as batch_op:
        batch_op.alter_column('answer',
               existing_type=sa.TEXT(),
               nullable=True)

    # ### end Alembic commands ###