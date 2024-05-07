import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/random;
import ballerinax/googleapis.drive;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;

const TOTAL_MACBOOK_WINNERS = 10;

configurable string mode = "LOCAL";
configurable string csvFilePath = "/tmp/drawEntries.csv";
configurable string refreshToken = "";
configurable string clientId = "";
configurable string clientSecret = "";
configurable string refreshUrl = drive:REFRESH_URL;
configurable string fileId = "";

configurable string user = ?;
configurable string password = ?;
configurable string host = ?;
configurable int port = 21113;
configurable string database = ?;

drive:ConnectionConfig config = {
    auth: {
        clientId,
        clientSecret,
        refreshUrl,
        refreshToken
    }
};
// In local mode, google drive is not used
final drive:Client|error driveClient = new (config);

// Incase of an error with database, still continue as the database is not mandatory
final mysql:Client|error dbClient = new(host, user, password, database, port);

service / on new http:Listener(9090) {

    function init() returns error? {
        // Download the file from google drive if the mode is not LOCAL
        if mode != LOCAL {
            log:printInfo("Downloading file from google drive");
            error? downloadFile = getFileFromGoogleDrive(driveClient);
            if downloadFile is error {
                log:printError("Error downloading file from google drive: ", downloadFile);
                return error("Error downloading file from google drive");
            }
        }
        log:printInfo("Service started");
    }

    isolated resource function get macbook\-winners(@http:Header {name: "X-JWT-Assertion"} string? jwtToken, 
            @http:Header {name: "X-Username"} string x_username) returns Participant[]|error {
        string username = check getUsername(jwtToken, x_username);
        string[][] data = check io:fileReadCsv(csvFilePath);

        int firstRowIndex = 0;
        int lastRowIndex = data.length() - 1;

        map<Participant> winnerMap = {};

        while winnerMap.length() < TOTAL_MACBOOK_WINNERS {
            int randomIndex = check random:createIntInRange(firstRowIndex, lastRowIndex);
            string[] participantDetails = data[randomIndex];
            string orgId = participantDetails[0];
            if winnerMap.hasKey(orgId) {
                continue;
            }
            string name = capitalizeName(data[randomIndex][1]);
            winnerMap[orgId] = {orgId, name, country: data[randomIndex][2]};
        }
        Participant[] winners = from Participant winner in winnerMap select winner;
        error? persistWinners = persistMacbookWinners(winners, username, dbClient);
        if persistWinners is error {
            log:printError("Error persisting macbook winners: ", persistWinners);
            // Ignore the error and return the winners as persisting the winners is not mandatory
        }
        return winners;
    }

    isolated resource function post cybertruck\-winner(@http:Header {name: "X-JWT-Assertion"} string? jwtToken,
            @http:Header {name: "X-Username"} string x_username, @http:Payload Participant[] payload) returns 
            Participant|error {
        string username = check getUsername(jwtToken, x_username);
        string[][] data = check io:fileReadCsv(csvFilePath);
        Participant[] macbookWinners = payload;
        Participant[]|error macbookWinnersInDatabase = getMacbookWinners(dbClient);
        
        if macbookWinnersInDatabase is error {
            log:printInfo("Error getting macbook winners from database. Hence, using the winners from the payload.");
        } else {
            // If there is an error with the database, use the winners from the request payload
            macbookWinners = macbookWinnersInDatabase;
        }

        int firstRowIndex = 0;
        int lastRowIndex = data.length() - 1;

        while true {
            int randomIndex = check random:createIntInRange(firstRowIndex, lastRowIndex);
            string name = capitalizeName(data[randomIndex][1]);
            Participant winner = {orgId: data[randomIndex][0], name, country: data[randomIndex][2]};
            final string winnerOrgId = winner.orgId;
            boolean alreadyWonMacbook = macbookWinners.some(isolated function(Participant macbookWinner) returns boolean {
                return macbookWinner.orgId == winnerOrgId;
            });
            if !alreadyWonMacbook {
                error? persist = persistCyberTruckWinner(winner, username, dbClient);
                if persist is error {
                    log:printError("Error persisting cybertruck winner: ", persist);
                    // Ignore the error and continue as persisting the winner is not mandatory
                }
                return winner;
            }
        }
    }
}
