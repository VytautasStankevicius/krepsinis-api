class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString
    }
    
    filter(){
        const queryObj = {...this.queryString}
        const excludedFields = ["page", "sort", "limit", "fields"];
        excludedFields.forEach((el)=>{delete queryObj[el]});
        
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>`$${match}`)
        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }

    sort(){
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ')
            this.query = this.query.sort(sortBy)
        }else{
            this.query = this.query.sort({ ranking: 1 });
        }
        return this
    }

    limitFields(){
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields)
        }else{
            this.query = this.query.select('-__v')
        }
        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        if (this.queryString.page) {
            try {
                const numberOfParticipants = this.query.model.countDocuments();
                if (skip >= numberOfParticipants) {
                    throw new Error('This page does not exist');
                }
                this.totalParticipants = numberOfParticipants;
                this.totalPages = Math.ceil(numberOfParticipants / limit);
            } catch (error) {
                throw new Error(error.message);
            }
        }
        return this;
    };
    
}

module.exports = APIFeatures