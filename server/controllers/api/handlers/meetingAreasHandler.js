var MeetingArea = require('../../../../server/models/meetingArea');
var ObjectId = require('mongoose').Types.ObjectId;
var logger = require('winston');

var getMeetingAreasWithParentId = function(req, res, next) {
    // TODO: add retrieving only meeting areas the user has access to.
    // Check for parent query parameters.
    var parentId = req.query.parentId;

    if ( parentId === "null" ) {
        parentId = null;
    }
    else if ( parentId === null ) {
        return next("Error: query parameter for parentId must be specified!");
    }

    MeetingArea.find({ parentMeetingArea: (parentId === null ? null : new ObjectId(parentId)) }, function(err, meetingAreas) {
        if ( err ) { return next(err); }
        res.status(200).json(meetingAreas);
    });
};

var getMeetingArea = function(req, res, next) {
    // TODO: add retrieving only meeting areas the user has access to.
    MeetingArea.findOne({ _id: req.params.meetingAreaId }, function(err, meetingArea) {
        if ( err ) { return next(err); }

        res.status(200).json(meetingArea);
    });
};

var createNewMeetingArea = function(req, res, next) {
    var parentId = req.body.parentMeetingAreaId;

    var meetingArea = new MeetingArea({
        title: req.body.title,
        description: req.body.description,
        parentMeetingArea: parentId ? new ObjectId(parentId) : null
    });

    meetingArea.save(function(err, savedMeetingArea) {
        if (err) {
            logger.error("Error saving meeting area: " + err.message);
            return next(err);
        }

        res.status(201).json(savedMeetingArea);
    });
};

var updateMeetingArea = function(req, res, next) {
    MeetingArea.findOne({ _id: req.params.meetingAreaId }, function(err, meetingArea) {
        if (err) { return next(err); }

        meetingArea.title = req.params.title;
        meetingArea.description = req.params.description;

        meetingArea.save(function(err) {
            if (err) {
                logger.error("Error updating meeting area: " + err.message);
                return next(err);
            }
            res.status(200);
        });
    });
};

var deleteMeetingArea = function(req, res, next) {
    MeetingArea.findOneAndRemove({ _id: req.params.meetingAreaId }, function(err) {
        if (err) { return next(err); }
        res.sendStatus(200);
    });
};

module.exports = {
    getMeetingArea: getMeetingArea,
    createNewMeetingArea: createNewMeetingArea,
    updateMeetingArea: updateMeetingArea,
    deleteMeetingArea: deleteMeetingArea,
    getMeetingAreasWithParentId: getMeetingAreasWithParentId
};