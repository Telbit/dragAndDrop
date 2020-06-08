from psycopg2 import sql
from psycopg2._psycopg import cursor
from psycopg2.extras import RealDictCursor
import database_common


@database_common.connection_handler
def get_images(cursor: RealDictCursor) -> list:
    query = """
            SELECT id, path, order_id
            FROM images
            ORDER BY order_id;"""
    cursor.execute(query)
    return cursor.fetchall()


@database_common.connection_handler
def new_image(cursor: RealDictCursor, path: str):
    query = """
            INSERT INTO images (path, order_id) 
            VALUES (%(path)s, (SELECT MAX(order_id) FROM images) + 1)"""
    cursor.execute(query, {'path': path})


@database_common.connection_handler
def order_update(cursor: RealDictCursor, order_id: int, new_order_id: int):
    query = ""
    if new_order_id > order_id:
        query += """
                UPDATE images
                SET order_id = order_id - 1
                WHERE order_id > %(order_id)s AND order_id <= %(new_order_id)s;"""
    else:
        query += """
                UPDATE images
                SET order_id = order_id + 1
                WHERE order_id >= %(new_order_id)s AND order_id < %(order_id)s;"""
    cursor.execute(query, {'order_id': order_id, 'new_order_id': new_order_id})


@database_common.connection_handler
def change_order_id_by_id(cursor: RealDictCursor, image_id: int, new_order_id: int):
    query = """
            UPDATE images
            SET order_id = %(new_order_id)s
            WHERE id = %(image_id)s;"""
    cursor.execute(query, {'image_id': image_id, 'new_order_id': new_order_id})
