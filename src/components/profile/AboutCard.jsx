import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
export const AboutCard = ({ biography, careerGoals, researchInterests, academicInterests, }) => {
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-pine">AB</span>
        <CardTitle>About me</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="about-row">
          <div className="about-label">Bio</div>
          <div className="about-text">{biography}</div>
        </div>
        <div className="about-row">
          <div className="about-label">Career goals</div>
          <div className="about-text">{careerGoals}</div>
        </div>
        <div className="about-row">
          <div className="about-label">Research interests</div>
          <div className="about-text">{researchInterests}</div>
        </div>
        <div className="about-row">
          <div className="about-label">Academic interests</div>
          <div className="about-text">{academicInterests}</div>
        </div>
      </CardContent>
    </Card>);
};
export default AboutCard;
