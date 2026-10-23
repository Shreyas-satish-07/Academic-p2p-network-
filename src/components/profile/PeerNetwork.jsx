import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import Button from '../ui/button';
import { ROUTES } from '../../constants/routes';
export const PeerNetwork = ({ peers, onShowToast }) => {
    const navigate = useNavigate();
    const [connectedPeers, setConnectedPeers] = useState({});
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('');
    };
    const getColors = (index) => {
        const colorSchemes = [
            { bg: 'var(--pine-tint)', text: 'var(--pine-dark)' },
            { bg: 'var(--marigold-tint)', text: 'var(--marigold)' },
            { bg: 'var(--slate-tint)', text: 'var(--slate)' },
        ];
        return colorSchemes[index % colorSchemes.length];
    };
    const handleConnect = (peerId, peerName) => {
        if (connectedPeers[peerId])
            return;
        setConnectedPeers(prev => ({ ...prev, [peerId]: true }));
        onShowToast(`Connection request sent to ${peerName}`);
    };
    return (<Card>
      <CardHeader>
        <span className="card-tab tab-marigold">PN</span>
        <CardTitle>Peer network</CardTitle>
        <span className="card-link" onClick={() => navigate(ROUTES.PEER_MATCH)}>See all</span>
      </CardHeader>
      <CardContent>
        <div className="peer-grid">
          {peers.map((peer, index) => {
            const colors = getColors(index);
            const isConnected = connectedPeers[peer.id];
            return (<div key={peer.id} className="rail-peer">
                <div className="rail-peer-avatar" style={{ background: colors.bg, color: colors.text }}>
                  {getInitials(peer.name)}
                </div>
                <div className="rail-peer-info">
                  <div className="n">{peer.name}</div>
                  <div className="skills">{peer.department}</div>
                </div>
                <div className="rail-peer-right">
                  <span className="match-pct">{peer.matchPercentage}%</span>
                  <Button className={`connect-btn ${isConnected ? 'sent' : ''}`} onClick={() => handleConnect(peer.id, peer.name)}>
                    {isConnected ? 'Request Sent' : 'Connect'}
                  </Button>
                </div>
              </div>);
        })}
        </div>
      </CardContent>
    </Card>);
};
export default PeerNetwork;
