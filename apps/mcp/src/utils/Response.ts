class Response {
    public statusCode: number;
    public message: string;
    public data: string | number | boolean | object | null;
    public success: boolean;
  
    constructor(statusCode: number, message: string = "Success", data: string | number | boolean | object | null) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.success = statusCode < 400;
    }
  }
  
  export default Response;