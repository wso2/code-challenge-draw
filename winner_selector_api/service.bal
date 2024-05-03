import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/random;
import ballerinax/googleapis.drive;
import ballerinax/mysql.driver as _;
import ballerinax/mysql;

const noOfTotalMacbookWinners = 10;
const X_JWT_ASSERTION = "X-JWT-Assertion";

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
final mysql:Client dbClient = check new(HOST, USER, PASSWORD, DATABASE, PORT);

service / on new http:Listener(9090) {

    function init() returns error? {
        drive:FileContent fileContent = check driveClient->getFileContent(fileId);
        byte[] content = fileContent.content;
        error? writeFile = io:fileWriteBytes(csvFilePath, content);
        if writeFile is error {
            log:printError("Error writing file: ", writeFile);
        }
        log:printInfo("Service started");
    }

    isolated resource function get macbook\-winners(@http:Header {name: X_JWT_ASSERTION} string jwtToken) returns 
            Participant[]|error {
        string username = check getUsernameFromJwt(jwtToken);
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
        check persistMacbookWinners(winners, username);
        return winners;
    }

    isolated resource function get cybertruck\-winner(@http:Header {name: X_JWT_ASSERTION} string jwtToken) returns 
            Participant|error {
        string username = check getUsernameFromJwt(jwtToken);
        string[][] data = check io:fileReadCsv(csvFilePath);
        Participant[] macbookWinners = check getMacbookWinners();

        int firstRowIndex = 0;
        int lastRowIndex = data.length() - 1;

        while true {
            int randomIndex = check random:createIntInRange(firstRowIndex, lastRowIndex);
            string name = capitalizeName(data[randomIndex][1]);
            Participant winner = {orgId: data[randomIndex][0], name, country: data[randomIndex][2]};
            final string winnerOrgId = winner.orgId;
            boolean alreadyWonMacbook = macbookWinners.some(isolated function (Participant macbookWinner) returns boolean {
                return macbookWinner.orgId == winnerOrgId;
            });
            if !alreadyWonMacbook {
                check persistCyberTruckWinner(winner, username);
                return winner;
            }
        }
    }
}
