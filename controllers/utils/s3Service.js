

module.exports = (s3) => {


    class S3Service {

        constructor(bucketName, region) {
            this.bucketName = bucketName;
            this.region = region;
        }

        getBucketName() {
            return this.bucketName;
        }

        getRegion() {
            return this.region;
        }

        async listAllObjectsFromS3Bucket(prefix) {
            let isTruncated = true;
            let marker;
            let resultList = [];
            while(isTruncated) {
                let params = { Bucket: this.getBucketName() };
                if (prefix) params.Prefix = prefix;
                if (marker) params.Marker = marker;
                try {
                    const response = await s3.listObjects(params).promise();
                    response.Contents.forEach(item => {
                        resultList.push(item.Key);
                    });
                    isTruncated = response.IsTruncated;
                if (isTruncated) {
                    marker = response.Contents.slice(-1)[0].Key;
                }
                } catch(error) {
                    throw error;
                }
            }

            return resultList;
        }
          

        getS3FileURL(filename) {
            return "https://" + this.getBucketName() + ".s3.amazonaws.com/" + filename;
        }

        getS3FileURLPath(filename) {
            return "https://s3-" + this.getRegion() + ".amazonaws.com/" + this.getBucketName() + "/" + filename;
        }

    }

    return {
        S3Service: S3Service
    };

};