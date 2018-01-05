# Source A
import unittest
from context import models

class testModels(unittest.TestCase):
    def setUp(self):
        self.accounts = models.accounts()
        self.adultId1 = 'a_1'
        self.adultPin1 = '1234'
        self.familyId1 = 'f_1'
        self.adultId2 = 'a_3'
        self.adultPin2 = '4321'

        # only create two users once
        try:
            self.accounts.getFamily(self.familyId1)
        except:
            self.accounts.createAccount(
                self.familyId1,
                self.adultId1, 
                self.adultPin1
            )
            self.accounts.addAdultToFamily(
                self.familyId1,
                self.adultId2,
                self.adultPin2
            )

    def testCreateAccount(self):
        adultId1 = self.adultId1
        adultPin1 = self.adultPin1
        familyId1 = self.familyId1
        adultId2 = self.adultId2
        adultPin2 = self.adultPin2

        # test successul operation
        adult = self.accounts.getAdult(adultId1)
        pin = self.accounts.getAdultPin(adultId1)
        lockState = self.accounts.getAdultLock(adultId1)
        family = self.accounts.getFamily(familyId1)
        self.assertTrue(adult is not None)
        self.assertEqual(adult.id, adultId1)
        self.assertEqual(adult.familyId, familyId1) 
        self.assertEqual(family.id, familyId1)
        self.assertTrue(family.adults is not None)
        self.assertEqual(family.adults[0], adultId1)
        self.assertEqual(pin, adultPin1)
        self.assertFalse(lockState)
        
        # test suscces for second adult add
        a2 = self.accounts.getAdult(adultId2)
        self.assertTrue(a2.id == adultId2)
        self.assertTrue(a2.familyId == familyId1)
        self.assertFalse(a2.lock)
        self.assertEqual(a2.pin, adultPin2)
        
        # test error cases
        with self.assertRaises(Exception) as context:
            self.accounts.createAccount(familyId1, 'a_2', adultPin1)
        self.assertTrue('family already exists' in context.exception)

        with self.assertRaises(Exception) as context:
            self.accounts.createAccount('f_2', adultId1, adultPin1)
        self.assertTrue('adult already exists' in context.exception)

        # test error case between entities 
        self.accounts.createAccount('f_2','a_2', adultPin1)
        with self.assertRaises(Exception):
            self.accounts.addAdultToFamily('a_1','f_1', adultPin1)
        
        with self.assertRaises(Exception):
            self.accounts.addAdultToFamily('a_1', 'f_2', adultPin1)
        
        with self.assertRaises(Exception):
            self.accounts.addAdultToFamily('a_2', 'f_1', adultPin1)

    def testLock(self):
        adultId1 = self.adultId1
        self.accounts.setAdultLock(adultId1, True)
        self.assertTrue(self.accounts.getAdultLock(adultId1))

        self.accounts.setAdultLock(adultId1, False)
        self.assertFalse(self.accounts.getAdultLock(adultId1))
        
    def testContacts(self):
        adultId1 = self.adultId1
        adultId2 = self.adultId2

        contacts1 = self.accounts.getAdultContacts(adultId1)
        self.assertEqual(len(contacts1), 0)

        # only adultId1 sees new contact
        self.accounts.addAdultContact(adultId1, adultId2, 'ch_1')
        contacts1 = self.accounts.getAdultContacts(adultId1)
        self.assertEqual(len(contacts1), 1)
        self.assertEqual(contacts1[0], adultId2)
        contacts2 = self.accounts.getAdultContacts(adultId2)
        self.assertEqual(len(contacts2), 0)
                
        # no channel as other adult has not added contact
        channel = self.accounts.getAdultContactChannel(adultId1, adultId2)
        self.assertEqual(channel, '')
        with self.assertRaises(Exception) as context:
            channel = self.accounts.getAdultContactChannel(adultId2, adultId1)
        self.assertTrue('contact not in contacts' in context.exception)

        # channel visible once other adult adds contact
        self.accounts.addAdultContact(adultId2, adultId1, 'ch_1')
        contacts1 = self.accounts.getAdultContacts(adultId1)
        self.assertEqual(len(contacts1), 1)
        self.assertEqual(contacts1[0], adultId2)
        contacts2 = self.accounts.getAdultContacts(adultId2)
        self.assertEqual(len(contacts2), 1)
        self.assertEqual(contacts2[0], adultId1)

        channel = self.accounts.getAdultContactChannel(adultId1, adultId2)
        self.assertEqual(channel, 'ch_1')
        channel = self.accounts.getAdultContactChannel(adultId2, adultId1)
        self.assertEqual(channel, 'ch_1')

        # adultId2 deletes contact, adultsId2 contacts remain unchanged
        # adultId1 channel reverts back to ''
        self.accounts.deleteAdultContact(adultId2, adultId1)
        contacts1 = self.accounts.getAdultContacts(adultId1)
        self.assertEqual(len(contacts1), 1)
        self.assertEqual(contacts1[0], adultId2)
        contacts2 = self.accounts.getAdultContacts(adultId2)
        self.assertEqual(len(contacts2), 0)
        channel = self.accounts.getAdultContactChannel(adultId1, adultId2)
        self.assertEqual(channel, '')
        with self.assertRaises(Exception) as context:
            channel = self.accounts.getAdultContactChannel(adultId2, adultId1)
        self.assertTrue('contact not in contacts' in context.exception)

        # adultId1 deletes contact, no contacts exist
        self.accounts.deleteAdultContact(adultId1, adultId2)
        contacts1 = self.accounts.getAdultContacts(adultId1)
        self.assertEqual(len(contacts1), 0)
        contacts2 = self.accounts.getAdultContacts(adultId1)
        self.assertEqual(len(contacts2), 0)
        with self.assertRaises(Exception) as context:
            channel = self.accounts.getAdultContactChannel(adultId1, adultId2)
        self.assertTrue('contact not in contacts' in context.exception)
        with self.assertRaises(Exception) as context:
            channel = self.accounts.getAdultContactChannel(adultId2, adultId1)
        self.assertTrue('contact not in contacts' in context.exception)

        # deleteing a nonexisting contact throws
        with self.assertRaises(Exception) as context:
            self.accounts.deleteAdultContact(adultId1, adultId2)
        self.assertTrue('contact not in contacts' in context.exception)

if __name__ == '__main__':
    unittest.main()