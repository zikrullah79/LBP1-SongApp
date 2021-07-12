class UploadsHandler {
    constructor(service,validator){
        this._service = service;
        this._validator = validator;

        this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
    }

    async postUploadImageHandler(request,h){

        const {data} = request.payload;
        
        this._validator.validateUploadsHeader(data.hapi.headers);
        const filename = await this._service.writeFile(data,data.hapi)

        const response = h.response({
            status : "success",
            message : "Gambar berhasil diunggah",
            data : {
                pictureUrl : `${process.env.HOST}:${process.env.PORT}/upload/${filename}`
            }
        })
        response.code(201);
        return response;
    }
}
module.exports = UploadsHandler;