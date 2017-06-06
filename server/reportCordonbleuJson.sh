#!/bin/bash

begin_date=$1;
end_date=$2;
team=$3


mongo cordonbleu --eval 'var printStats = function(db, team, dateDebut, dateFin, users) {
	var teams;print(team);
	if(team == null || team == undefined || team == "") {
		teams = db.team.find({},{_id:1, name:1});
	} else {
		teams = db.team.find({"name.unique" : team.toLowerCase()},{_id:1, name:1});
	}
	print("{\"projects\":[");

	var cpt = 0;
	teams.forEach(function (team) {
		if(cpt > 0) {
			print(",");
		}

		print("{\"team\":\"" + team.name.value+"\",");

		var re = users;
		
		var nbCommitThisWeek = db.commit.find({ "_id.team" : team._id,  "created": {  $gt : ISODate(dateDebut),  $lt : ISODate(dateFin) }, "author.name" : {$regex :eval(re)}  }).count();
		print("\"commitNumber\" : " + nbCommitThisWeek + ",");
		
		var nbCommitApprove = db.commit.find({ "_id.team": team._id,  "created": {  $gt : ISODate(dateDebut),  $lt : ISODate(dateFin) }, approval : {$ne: null}, "author.name" : {$regex :eval(re)}}).count();
		print("\"approveCommitNumber\" : " + nbCommitApprove + ",");

		var nbCommitComment = db.commit.find({ "_id.team": team._id,  "created": {  $gt : ISODate(dateDebut),  $lt : ISODate(dateFin) }, comments : {$gt: []}, "author.name" : {$regex :eval(re)} }).count();
		print("\"commentCommitNumber\" : " + nbCommitComment + ",");

		var nbCommitWithoutReview = db.commit.find({ "_id.team": team._id,  "created": {  $gt : ISODate(dateDebut),  $lt : ISODate(dateFin) }, approval : null, comments : [],  "author.name" : {$regex :eval(re)}}).count();	
		print("\"notReviewCommitNumber\" : " + nbCommitWithoutReview+ ",");				
		var nbCommitProposeToCollectiveReview = db.commit.find({ "_id.team": team._id,  "created": {  $gt : ISODate(dateDebut),  $lt : ISODate(dateFin) }, proposeToCollectiveReview : true}).count();
		
		print("\"ratioCommitReview\" : " + (nbCommitThisWeek === 0 ? "100" : Math.ceil(((nbCommitThisWeek-nbCommitWithoutReview)/nbCommitThisWeek) * 100)) + "");

		print("}");

		cpt=cpt+1;
	});
	print("]}");
};

printStats(db, "'$team'", "'+$begin_date+'T00:00:00Z", "'+$end_date+'T23:59:59Z", "/^/i");
'



