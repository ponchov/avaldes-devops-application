import _ from 'lodash';
import AWS from 'aws-sdk';
import config from '../../helpers/config_helper';
import ResponseHelper from '../../helpers/response_helper';
import httpConstants from '../../config/http_constants';
import BaseController from '../utils/controller_factory';
import S3ServiceLib from '../utils/s3Service';

// setup using the custom aws keys from the config file
const accessKeyId = config.aws.access_key;
const secretAccessKey = config.aws.secret_key;
const region = config.aws.region;

AWS.config.update(
    {
        accessKeyId,
        secretAccessKey,
        region,
    }
);


const FilesController = function FilesController() {

    // Set base for inheritance
    const base = !(this instanceof FilesController) ? new BaseController() : BaseController;

    return Object.assign(Object.create(base), { 

            files: (req, res) => {
                const s3 = new AWS.S3({});
                const S3Service = S3ServiceLib(s3).S3Service;
                const S3ServiceInstance = new S3Service(config.aws.bucket_name, config.aws.aws_region);
                
                S3ServiceInstance.listAllObjectsFromS3Bucket(false)
                .then((result) => {
                    return ResponseHelper.sendSingleResult(res, result);
                })
                .catch((err) => {
                    return ResponseHelper.sendCustomError(
                        res,
                        httpConstants.BAD_REQUEST,
                        ResponseHelper.findErrorMessage(err),
                    );
                });
            }
        }
    );

};

const filesController = FilesController();

export { filesController };
