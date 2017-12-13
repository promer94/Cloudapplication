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

    def getFamily(self, familyId):
        if familyId in self.familys:
            return self.familys[familyId]
        else:
            return None

    def getAdult(self, adultId):
        if adultId in self.adults:
            return self.adults[adultId]
        else:
            return None

    # creates a adult and inserts into adults
    # does not check for existance of familyId
    def __createAdult(self, adultId, familyId):
        if self.getAdult(adultId):
            raise Exception('adult already exists')
        adult = Bunch(id = adultId, familyId = familyId)
        self.adults[adultId] = adult
    
    # throws if family already exists
    # we assume that a adult can only be a member of one family
    # so we add the adult at the same time as adding the family
    # throws if family exists
    # throws if adult exists
    def createAccount(self, familyId, adultId):
        if self.getFamily(familyId):
            raise Exception('family already exisits')

        self.__createAdult(adultId, familyId)
        family = Bunch(id = familyId, adults = [adultId])
        self.familys[familyId] = family
        return family

    # creates a user an inserts them into users
    # throws if family dose not exist
    # thows if user already exists
    def addAdultToFamily(self, adultId, familyId):
        family = self.getFamily(familyId)
        if not family:
            raise Exception('familyId dose not exist')
        self.__createAdult(adultId, familyId)
        family.adults.append(adultId)