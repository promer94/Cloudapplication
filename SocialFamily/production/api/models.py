# Source A
# defines the wrapper for accessing the data base
class Bunch(object):
    def __init__(self, **kwds):
        self.__dict__.update(kwds)
    def __str__(self):
        output = '{'
        for attr, value in self.__dict__.iteritems():
            output = output + attr + ':' + value

# an account at its minimum has a registered adult with a registered family id
# an account can have multiple adults and childeren
class accounts(object):
    adults = {}
    children = {}
    familys = {}

    def __existFamily(self, familyId):
        return familyId in self.familys

    def getFamily(self, familyId):
        if self.__existFamily(familyId):
            return self.familys[familyId]
        else:
            raise Exception('familyId dose not exist')

    def __existAdult(self, adultId):
        return adultId in self.adults

    def getAdult(self, adultId):
        if self.__existAdult(adultId):
            return self.adults[adultId]
        else:
            raise Exception('AdultId dose not exist')
        
    # creates a adult and inserts into adults
    # does not check for existance of familyId
    def __createAdult(self, adultId, familyId, pin):
        if self.__existAdult(adultId):
            raise Exception('adult already exists')
        adult = Bunch(
            id = adultId, 
            familyId = familyId, 
            pin=pin, 
            contacts = {},
            lock = False
        )
        self.adults[adultId] = adult
    
    # throws if family already exists
    # we assume that a adult can only be a member of one family
    # so we add the adult at the same time as adding the family
    # throws if family exists
    # throws if adult exists
    def createAccount(self, familyId, adultId, pin):
        if self.__existFamily(familyId):
            raise Exception('family already exists')

        self.__createAdult(adultId, familyId, pin)
        family = Bunch(id = familyId, adults = [adultId])
        self.familys[familyId] = family
        return family

    # creates a user an inserts them into users
    # throws if family dose not exist
    # thows if user already exists
    def addAdultToFamily(self, familyId, adultId, pin):
        family = self.getFamily(familyId)
        self.__createAdult(adultId, familyId, pin)
        family.adults.append(adultId)

    # gets adults pin
    # throws if adultId dose not exist
    def getAdultPin(self, adultId):
        return self.getAdult(adultId).pin

    # sets the lock state
    # throws if adultId dose not exist
    def setAdultLock(self, adultId, locked):
        adult = self.getAdult(adultId)
        adult.lock = locked

    # gets lock state
    # throws if adultId dose not exist
    def getAdultLock(self, adultId):
        return self.getAdult(adultId).lock

    # add contact to adult user
    # throws if adult or contact dose not exist or if contact is already added
    def addAdultContact(self, adultId, adultContactId, channelId):
        adult = self.getAdult(adultId)
        # implicately check that contact exists by calling getAdult
        if self.getAdult(adultContactId).id in adult.contacts:
            raise Exception('contact already exists')
        
        adult.contacts[adultContactId] = channelId

    # throws if adilt dose not exist
    def getAdultContacts(self, adultId):
        return self.getAdult(adultId).contacts.keys()

    # throws if adultId or contactId dose not exist
    # returns a '' if contact dose not have adultId as a 
    # contact
    def getAdultContactChannel(self, adultId, contactId):
        adult = self.getAdult(adultId)
        contact = self.getAdult(contactId)

        if contactId not in adult.contacts:
            raise Exception('contact not in contacts')

        # if adultId not in contact.contacts then the
        # contact has not added adultId to their contacts
        # and there for chat is not allowed
        if adultId not in contact.contacts:
            return ''
        else:
            return adult.contacts[contactId]

    # throws if the adult or contact do not exist or if
    # contact is not in the contact list
    def deleteAdultContact(self, adultId, contactId):
        adult = self.getAdult(adultId)
        contact = self.getAdult(contactId)

        if contactId not in adult.contacts:
            raise Exception('contact not in contacts')

        adult.contacts.pop(contactId)
