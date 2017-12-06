# Source A
import unittest
from context import models

class testModels(unittest.TestCase):
    accounts = None
    def setUp(self):
        self.accounts = models.accounts()

    def testCreateAccount(self):
        adultId = 'a_1'
        familyId = 'f_1'

        # test successul operation
        self.accounts.createAccount(familyId, adultId)
        adult = self.accounts.getAdult(adultId)
        family = self.accounts.getFamily(familyId)
        self.assertTrue(adult is not None)
        self.assertEqual(adult.id, adultId)
        self.assertEqual(adult.familyId, familyId) 
        self.assertEqual(family.id, familyId)
        self.assertTrue(family.adults is not None)
        self.assertEqual(family.adults[0], adultId)
        
        # test suscces for second adult add
        self.accounts.addAdultToFamily('a_3', 'f_1')
        a3 = self.accounts.getAdult('a_3')
        self.assertTrue(a3.id == 'a_3')
        self.assertTrue(a3.familyId == 'f_1')
        
        # test error cases
        with self.assertRaises(Exception) as context:
            self.accounts.createAccount(familyId, 'a_2')
        self.assertTrue('family already exisits' in context.exception)

        with self.assertRaises(Exception) as context:
            self.accounts.createAccount('f_2', adultId)
        self.assertTrue('adult already exists' in context.exception)

        # test error case between entities 
        self.accounts.createAccount('f_2','a_2')
        with self.assertRaises(Exception):
            self.accounts.addAdultToFamily('a_1','f_1')
        
        with self.assertRaises(Exception):
            self.accounts.addAdultToFamily('a_1', 'f_2')
        
        with self.assertRaises(Exception):
            self.accounts.addAdultToFamily('a_2', 'f_1')


if __name__ == '__main__':
    unittest.main()