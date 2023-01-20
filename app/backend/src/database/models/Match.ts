import { DataTypes, Model } from 'sequelize';
import connection from './index';
import Team from './Team';

class Match extends Model {
  declare id: number;
  declare homeTeamId: number;
  declare homeTeamGoals: number;
  declare awayTeamId: number;
  declare awayTeamGoals: number;
  declare inProgress: boolean;
}

Match.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  homeTeamId: {
    type: DataTypes.INTEGER,
    field: 'home_team_id',
    allowNull: false,
  },
  homeTeamGoals: {
    type: DataTypes.INTEGER,
    field: 'home_team_goals',
    allowNull: false,
  },
  awayTeamId: {
    type: DataTypes.INTEGER,
    field: 'away_team_id',
    allowNull: false,
  },
  awayTeamGoals: {
    type: DataTypes.INTEGER,
    field: 'away_team_goals',
    allowNull: false,
  },
  inProgress: {
    type: DataTypes.BOOLEAN,
    field: 'in_progress',
    allowNull: false,
  },
}, {
  sequelize: connection,
  tableName: 'matches',
  timestamps: false,
  underscored: true,
});

Team.hasMany(Match, { foreignKey: 'home_team_id' });
Team.hasMany(Match, { foreignKey: 'away_team_id' });

Match.belongsTo(Team, { foreignKey: 'home_team_id' });
Match.belongsTo(Team, { foreignKey: 'away_team_id' });

export default Match;
