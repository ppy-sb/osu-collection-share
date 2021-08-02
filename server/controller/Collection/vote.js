const Mongoose = require('mongoose')
const models = require('../../database/models')
const VOTE = {
  UP: 1,
  DOWN: -1,
  UNVOTE: 0
}

module.exports = async ({ user, session, slug, /* voteup = 1 votedown = -1 unvote = 0 */ vote }) => {
  vote = parseInt(vote)
  if (![VOTE.DOWN, VOTE.UP, VOTE.UNVOTE].includes(vote)) { throw new Error('illegal vote') }
  const collectionDB = await models.CollectionDB.findOne({ slug })
  if (!collectionDB) { throw new Error('collectiondb not found') }
  if (user) {
    const voted = await models.Vote.findOne({ 'user._id': user._id, 'collectionDB._id': Mongoose.Types.ObjectId(collectionDB) })
    if (!voted) {
      // should not happen: unvote the unvoted
      if (vote === VOTE.UNVOTE) {
        return {
          success: true,
          vote: collectionDB.count.vote
        }
      }
      // save vote
      const voteRecord = new models.Vote({
        user,
        collectionDB,
        vote
      })
      const result = await voteRecord.save()
      if (!result) { throw new Error('vote: failed, reason: save user record failed.') }

      const _vote = (vote === VOTE.UP
        ? 'count.vote.up'
        : 'count.vote.down')
      const updated = await models.CollectionDB.findOneAndUpdate({ _id: collectionDB._id }, {
        $inc: {
          [_vote]: 1
        }
      }, { new: true })
      return {
        success: true,
        vote: updated.count.vote
      }
    } else {
      // voted before
      switch (vote) {
        case voted.vote: {
          throw new Error('same vote')
        }
        case VOTE.DOWN: {
          // was vote.up now vote.down
          voted.vote = VOTE.DOWN
          const update = await voted.save()
          if (!update) { throw new Error('save new vote failed') }
          const counterUpdateResult = await models.CollectionDB.findOneAndUpdate({ _id: collectionDB._id }, {
            $inc: {
              'count.vote.up': -1,
              'count.vote.down': 1
            }
          }, { new: true })
          return {
            success: true,
            vote: counterUpdateResult.count.vote
          }
        }
        case VOTE.UP: {
          // was vote.down now vote.up
          voted.vote = VOTE.UP
          const update = await voted.save()
          if (!update) { throw new Error('save new vote failed') }
          const counterUpdateResult = await models.CollectionDB.findOneAndUpdate({ _id: collectionDB._id }, {
            $inc: {
              'count.vote.up': 1,
              'count.vote.down': -1
            }
          }, { new: true })
          return {
            success: true,
            vote: counterUpdateResult.count.vote
          }
        }
        case VOTE.UNVOTE: {
          const del = await models.Vote.deleteOne({ _id: voted._id })
          if (!del?.deletedCount) { throw new Error('error when deleting the vote') }
          const _vote = (voted.vote === VOTE.UP
            ? 'count.vote.up'
            : 'count.vote.down')
          const counterUpdateResult = await models.CollectionDB.findOneAndUpdate({ _id: collectionDB._id }, {
            $inc: {
              [_vote]: -1
            }
          }, { new: true })
          return {
            success: true,
            vote: counterUpdateResult.count.vote
          }
        }
        default: {
          throw new Error('illegal vote: unexcepted vote status in the database.')
        }
      }
    }
  } else if (session) {
    const votedIndex = session.votes.findIndex(vote => vote.collectionDB._id.equals(collectionDB._id))
    const voted = session.votes[votedIndex]
    if (!voted) {
      // should not happen: unvote the unvoted
      if (vote === VOTE.UNVOTE) {
        return {
          success: true,
          vote: collectionDB.count.vote
        }
      }
      // save vote
      session.votes.push({
        collectionDB: {
          _id: collectionDB._id
        },
        vote
      })
      const _vote = (vote === VOTE.UP
        ? 'count.vote.up'
        : 'count.vote.down')
      const updated = await models.CollectionDB.findOneAndUpdate({ _id: collectionDB._id }, {
        $inc: {
          [_vote]: 1
        }
      }, { new: true })
      return {
        success: true,
        vote: updated.count.vote
      }
    } else {
      // voted before
      switch (vote) {
        case voted.vote: {
          throw new Error('same vote')
        }
        case VOTE.DOWN: {
          // was vote.up now vote.down
          voted.vote = VOTE.DOWN
          const counterUpdateResult = await models.CollectionDB.findOneAndUpdate({ _id: collectionDB._id }, {
            $inc: {
              'count.vote.up': -1,
              'count.vote.down': 1
            }
          }, { new: true })
          return {
            success: true,
            vote: counterUpdateResult.count.vote
          }
        }
        case VOTE.UP: {
          // was vote.down now vote.up
          voted.vote = VOTE.UP
          const counterUpdateResult = await models.CollectionDB.findOneAndUpdate({ _id: collectionDB._id }, {
            $inc: {
              'count.vote.up': 1,
              'count.vote.down': -1
            }
          }, { new: true })
          return {
            success: true,
            vote: counterUpdateResult.count.vote
          }
        }
        case VOTE.UNVOTE: {
          session.votes.splice(votedIndex, 1)
          const _vote = (voted.vote === VOTE.UP
            ? 'count.vote.up'
            : 'count.vote.down')
          const counterUpdateResult = await models.CollectionDB.findOneAndUpdate({ _id: collectionDB._id }, {
            $inc: {
              [_vote]: -1
            }
          }, { new: true })
          return {
            success: true,
            vote: counterUpdateResult.count.vote
          }
        }
        default: {
          throw new Error('illegal vote: unexcepted vote status in the database.')
        }
      }
    }
  }
}
