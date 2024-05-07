import ballerina/io;
import ballerina/jwt;
import ballerina/log;
import ballerina/sql;
import ballerina/lang.regexp;
import ballerinax/mysql;
import ballerinax/googleapis.drive;

isolated function getUsername(string? jwtToken, string username) returns string|error {
    if mode == LOCAL {
        return username;
    }
    if jwtToken !is string {
        return error("JWT token is not provided");
    }
    [jwt:Header, jwt:Payload] [_, payload] = check jwt:decode(jwtToken);
    string? sub = payload.sub;
    return sub.toString();
}

isolated function getMacbookWinners(mysql:Client|error mysqlClient) returns Participant[]|error {
    if mysqlClient is error {
        log:printError("Database client is not initialized", mysqlClient);
        return error("Database client is not initialized");
    } 
    sql:ParameterizedQuery query = `SELECT winners FROM macbook_winners ORDER BY timestamp DESC LIMIT 1`;
    json|error winnersJson = mysqlClient->queryRow(query);
    if winnersJson is error {
        log:printError("Error getting macbook winners from the database: ", winnersJson);
        return error("Error getting macbook winners");
    }
    Participant[] winners = check winnersJson.cloneWithType();
    return winners;
}

isolated function persistMacbookWinners(Participant[] winners, string username, mysql:Client|error mysqlClient) returns error? {
    if mysqlClient is error {
        log:printError("Database client is not initialized", mysqlClient);
        return error("Database client is not initialized");
    } 
    sql:ParameterizedQuery query = `INSERT INTO macbook_winners (username, winners) VALUES (${username}, 
        ${winners.toJsonString()});`;
    sql:ExecutionResult|error addMbWinners = mysqlClient->execute(query);
    if addMbWinners is error {
        log:printError("Error adding macbook winners: ", addMbWinners);
        return error("Error adding macbook winners");
    }
}

isolated function persistCyberTruckWinner(Participant winner, string username, mysql:Client|error mysqlClient) returns error? {
    if mysqlClient is error {
        log:printError("Database client is not initialized", mysqlClient);
        return error("Database client is not initialized");
    } 
    sql:ParameterizedQuery query = `INSERT INTO cybertruck_winner (username, winner) VALUES (${username}, 
        ${winner.toJsonString()});`;
    sql:ExecutionResult|error addTruckWinner = mysqlClient->execute(query);
    if addTruckWinner is error {
        log:printError("Error adding cybertruck winner: ", addTruckWinner);
        return error("Error adding cybertruck winner");
    }
}

isolated function uppercaseFirstLetter(string word) returns string {
    if word.length() == 0 {
        return word;
    }
    string firstLetter = word.substring(0, 1);
    return firstLetter.toUpperAscii() + word.substring(1);
}

isolated function capitalizeName(string name) returns string {
    string[] words = regexp:split(re ` `, name.toLowerAscii());
    string capitalizedName = from string word in words select uppercaseFirstLetter(word) + " ";
    return capitalizedName.trim();
}

isolated function getFileFromGoogleDrive() returns error? {
    drive:FileContent fileContent = check driveClient->getFileContent(fileId);
    byte[] content = fileContent.content;
    error? writeFile = io:fileWriteBytes(csvFilePath, content);
    if writeFile is error {
        log:printError("Error writing file: ", writeFile);
        return error("Error writing file");
    }
}
