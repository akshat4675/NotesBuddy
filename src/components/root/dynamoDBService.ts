  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  import { DynamoDBDocumentClient ,GetCommand, PutCommand, ScanCommand, DeleteCommand, GetCommandOutput, PutCommandOutput, ScanCommandOutput} from "@aws-sdk/lib-dynamodb";
  
  const client = new DynamoDBClient({
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    },
  });
  
  const docClient = DynamoDBDocumentClient.from(client);

  export const getEventById = async (id: string): Promise<GetCommandOutput> => {
    const command = new GetCommand({
      TableName: "CalendarEvents",
      Key: { id },
    });
    return await docClient.send(command);
  };

  export const addEvent = async (id: string, eventName: string, date: string  ): Promise<PutCommandOutput> => {
    const command = new PutCommand({
      TableName: "CalendarEvents",
      Item: {id, eventName, date  },
    });
    return await docClient.send(command);
  };

  // New function to fetch all events
  export const getAllEvents = async (): Promise<ScanCommandOutput> => {
    const command = new ScanCommand({
      TableName: "CalendarEvents",
    });
    return await docClient.send(command);
  };

  
  // New function to delete an event by its name
  export const deleteEventByName = async (id: string, eventName: string): Promise<void> => {
      const command = new DeleteCommand({
        TableName: "CalendarEvents",
        Key: {
          id,         // Partition key
          eventName,  // Sort key
        },
      });
      await docClient.send(command);
    };
