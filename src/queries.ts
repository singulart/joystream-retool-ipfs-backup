export const genericQuery = (queryParams: any) => {
  return {
    "userParams":
    {
      "queryParams": queryParams,
      "databaseNameOverrideParams":
      {
        "length": 0
      },
      "databaseHostOverrideParams":
      {
        "length": 0
      },
      "databaseUsernameOverrideParams":
      {
        "length": 0
      },
      "databasePasswordOverrideParams":
      {
        "length": 0
      }
    },
    "password": "",
    "environment": "production",
    "queryType": "SqlQueryUnified",
    "frontendVersion": "1",
    "releaseVersion": null,
    "includeQueryExecutionMetadata": false
  }
}

export const usersListQuery = () => genericQuery(
  {
    "0": true,
    "1": "%%",
    "2": true,
    "3": "%%",
    "4": true,
    "5": "%%",
    "6": true,
    "7": "%%",
    "8": false,
    "length": 9
  }
);

export const userDataQuery = (id: number) => genericQuery({"0": id,"length":1});

