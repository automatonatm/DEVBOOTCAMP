const mongoose = require('mongoose');

const  ReviewsSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxLength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add a some text']
    },
    rating : {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add rating between 1 and 10']
    },

    createAt: {
        type:  Date,
        default: Date.now
    },
    bootcamp : {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user : {
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    },
});

//add a constraint that allows a user to add only one review per bootcamp
ReviewsSchema.index({bootcamp: 1, user: 1}, {unique: true});

//static method to get average rating
ReviewsSchema.statics.getAverageRating  = async function (bootcampId) {

    const obj = await  this.aggregate([
        {
            $match:  {bootcamp: bootcampId}
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: {$avg :'$rating'}
            }
        }

    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        })
    } catch (err) {
        console.error((err))
    }
};


//call get Average rating after save
ReviewsSchema.post('save', function () {
    this.constructor.getAverageRating(this.bootcamp)
});



//call get Average rating before save
ReviewsSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.bootcamp)
});


module.exports = mongoose.model('Review', ReviewsSchema);