from django.test import TestCase, override_settings
from rest_framework.test import APITestCase
from tests.backend.tests import run_test
from tests.user_management.tests import run_create_account


# Insertion des Unit tests
class BackendTest(APITestCase):
    def test_run_test(self):
        run_test(self)

class UserManagement(APITestCase):
    def test_run_create_account(self):
        run_create_account(self)