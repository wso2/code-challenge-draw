import ballerina/jwt;
import ballerina/log;
import ballerina/sql;
import ballerina/lang.regexp;


isolated function getUsernameFromJwt(string jwtToken) returns string|error {
    [jwt:Header, jwt:Payload] [_, payload] = check jwt:decode(jwtToken);
    string? sub = payload.sub;
    return sub.toString();
}

isolated function getMacbookWinners() returns Participant[]|error {
    sql:ParameterizedQuery query = `SELECT winners FROM macbook_winners ORDER BY timestamp DESC LIMIT 1`;
    json winnersJson = check dbClient->queryRow(query);
    Participant[] winners = check winnersJson.cloneWithType();
    return winners;
}

isolated function persistMacbookWinners(Participant[] winners, string username) returns error? {
    sql:ParameterizedQuery query = `INSERT INTO macbook_winners (username, winners) VALUES (${username}, 
        ${winners.toJsonString()});`;
    sql:ExecutionResult|error addMbWinners = dbClient->execute(query);
    if addMbWinners is error {
        log:printError("Error adding macbook winners: ", addMbWinners);
        return error("Error adding macbook winners");
    }
}

isolated function persistCyberTruckWinner(Participant winner, string username) returns error? {
    sql:ParameterizedQuery query = `INSERT INTO cybertruck_winner (username, winner) VALUES (${username}, 
        ${winner.toJsonString()});`;
    sql:ExecutionResult|error addTruckWinner = dbClient->execute(query);
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
    string restOfWord = word.substring(1);
    return firstLetter.toUpperAscii() + restOfWord;
}

isolated function capitalizeName(string name) returns string {
    string capitalizedName = "";
    string[] words = regexp:split(re ` `, name.toLowerAscii());
    foreach string item in words {
        string capitalizedWord = uppercaseFirstLetter(item);
        capitalizedName = capitalizedName + " " + capitalizedWord;
    }
    return capitalizedName;
}
