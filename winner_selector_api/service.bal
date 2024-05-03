import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/random;
import ballerinax/googleapis.drive;
import ballerinax/mysql;
import ballerinax/mysql.driver as _;

const noOfTotalMacbookWinners = 10;

configurable string mode = "LOCAL";
configurable string csvFilePath = "/tmp/drawEntries.csv";
configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshUrl = drive:REFRESH_URL;
configurable string fileId = ?;

configurable string USER = ?;
configurable string PASSWORD = ?;
configurable string HOST = ?;
configurable int PORT = 21113;
configurable string DATABASE = ?;

drive:ConnectionConfig config = {
    auth: {
        clientId,
        clientSecret,
        refreshUrl,
        refreshToken
    }
};
final drive:Client driveClient = check new (config);
final mysql:Client|error dbClient = new(HOST, USER, PASSWORD, DATABASE, PORT);

service / on new http:Listener(9090) {

    function init() returns error? {
        if mode != LOCAL {
            log:printInfo("Downloading file from google drive");
            error? downloadFile = getFileFromGoogleDrive();
            if downloadFile is error {
                log:printError("Error downloading file from google drive: ", downloadFile);
                return error("Error downloading file from google drive");
            }
        }
        log:printInfo("Service started");
    }

    isolated resource function get macbook\-winners(@http:Header {name: X_JWT_ASSERTION} string? jwtToken, 
            @http:Header {name: X_USERNAME} string x_username) returns Participant[]|error {
        string username = check getUsername(jwtToken, x_username);
        Participant[] winners = [];
        string[][] data = check io:fileReadCsv(csvFilePath);

        int firstRowIndex = 0;
        int lastRowIndex = data.length() - 1;

        map<Participant> winnerMap = {};

        while winnerMap.length() < noOfTotalMacbookWinners {
            int randomIndex = check random:createIntInRange(firstRowIndex, lastRowIndex);
            string name = capitalizeName(data[randomIndex][1]);
            Participant winner = {orgId: data[randomIndex][0], name, country: data[randomIndex][2]};
            winnerMap[winner.orgId] = winner;
        }
        foreach Participant winner in winnerMap {
            winners.push(winner);
        }
        error? persistWinners = persistMacbookWinners(winners, username, dbClient);
        if persistWinners is error {
            log:printError("Error persisting macbook winners: ", persistWinners);
        }
        return winners;
    }

    isolated resource function post cybertruck\-winner(@http:Header {name: X_JWT_ASSERTION} string? jwtToken,
            @http:Header {name: X_USERNAME} string x_username, @http:Payload Participant[] payload) returns 
            Participant|error {
        string username = check getUsername(jwtToken, x_username);
        string[][] data = check io:fileReadCsv(csvFilePath);
        Participant[] macbookWinners = payload;
        Participant[]|error macbookWinnersInDatabase = getMacbookWinners(dbClient);
        
        if macbookWinnersInDatabase is error {
            log:printInfo("Error getting macbook winners from database. Hence, using the winners from the payload.");
        } else {
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
                }
                return winner;
            }
        }
    }
}
