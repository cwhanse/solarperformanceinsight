import json
import os
from uuid import uuid1


import pymysql
import pytest


@pytest.fixture(scope="session")
def connection():
    connection = pymysql.connect(
        host=os.getenv("MYSQL_HOST", "127.0.0.1"),
        port=int(os.getenv("MYSQL_PORT", 3306)),
        user="root",
        password="testpassword",
        database="spi_data",
        binary_prefix=True,
    )
    return connection


@pytest.fixture(scope="session")
def auth0_id():
    return "auth0|testuserid"


@pytest.fixture(scope="session")
def user_id():
    return str(uuid1())


@pytest.fixture(scope="session", params=[0, 1])
def bad_user(request):
    if request.param:
        return "auth0|otheruser"
    else:
        return "invalid"


@pytest.fixture(scope="session")
def system_id():
    return str(uuid1())


@pytest.fixture(scope="session")
def system_def():
    return "A System", json.dumps({"version": "1", "other_parameters": []})


@pytest.fixture(scope="session")
def standard_test_data(auth0_id, user_id, connection, system_id, system_def):
    curs = connection.cursor()
    otherid = str(uuid1())
    curs.executemany(
        "insert into users (id, auth0_id) values (uuid_to_bin(%s, 1), %s)",
        [(user_id, auth0_id), (otherid, "auth0|otheruser")],
    )
    curs.execute(
        "insert into systems (id, user_id, name, definition) values "
        "(uuid_to_bin(%s, 1), uuid_to_bin(%s, 1), %s, %s)",
        (system_id, user_id, *system_def),
    )
    connection.commit()
    yield
    curs.executemany(
        "delete from users where id = uuid_to_bin(%s, 1)", (user_id, otherid)
    )
    curs.execute("delete from systems where id = uuid_to_bin(%s, 1)", system_id)
    connection.commit()


@pytest.fixture()
def cursor(connection, standard_test_data):
    yield connection.cursor()
    connection.rollback()
