"""empty message

Revision ID: 2177d7f53736
Revises: 6cf86c056ce8
Create Date: 2024-08-28 19:13:13.548550

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2177d7f53736'
down_revision = '6cf86c056ce8'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('avatar_path',
               existing_type=sa.VARCHAR(length=255),
               type_=sa.String(length=300),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('avatar_path',
               existing_type=sa.String(length=300),
               type_=sa.VARCHAR(length=255),
               existing_nullable=True)

    # ### end Alembic commands ###
