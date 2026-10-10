import React, { useState } from 'react';
import { Modal } from './Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle, Clock, ShieldCheck, MessageSquare, Send } from 'lucide-react';

export function AlertDetailsModal({ alert, isOpen, onClose }) {
  const { updateAlertStatus, currentRole } = useApp();
  const [noteText, setNoteText] = useState('');

  if (!alert) return null;

  const handleStatusChange = (newStatus) => {
    updateAlertStatus(alert.id, newStatus, currentRole.title, noteText);
    setNoteText('');
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    updateAlertStatus(alert.id, alert.status, currentRole.title, noteText);
    setNoteText('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Alert Review: ${alert.title}`} maxWidth="max-w-2xl">
      <div className="space-y-4">
        {/* Severity Banner */}
        <div className="p-4 bg-slate-900 text-white rounded-lg flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge severity={alert.severity}>{alert.severity}</Badge>
              <span className="text-xs text-slate-400 font-mono">{alert.id} • {alert.category}</span>
            </div>
            <h4 className="text-lg font-bold mt-1 text-white">{alert.title}</h4>
            <p className="text-xs text-slate-300 font-medium">{alert.patientName} ({alert.bed})</p>
          </div>
          <div className="text-right text-xs font-mono text-slate-400">
            <div>Detected: {new Date(alert.detectedAt).toLocaleTimeString()}</div>
            <div>Status: <strong className="text-teal-400 font-bold uppercase">{alert.status}</strong></div>
          </div>
        </div>

        {/* Clinical Evidence & Finding Breakdown */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Supporting Clinical Evidence & Telemetry Metric
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Metric</span>
              <span className="font-bold text-slate-900">{alert.evidence?.metric || 'Telemetry Signal'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Recorded Value</span>
              <span className="font-bold text-red-600 font-mono">{alert.evidence?.value} {alert.evidence?.unit}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Threshold</span>
              <span className="font-mono text-slate-700">{alert.evidence?.threshold || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Signal Quality</span>
              <Badge severity={alert.evidence?.dataQuality === 'VALID' ? 'STABLE' : 'WARNING'} size="sm">
                {alert.evidence?.dataQuality || 'VALID'}
              </Badge>
            </div>
          </div>

          <div className="text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">Explanation:</p>
            <p className="bg-white p-2.5 rounded border border-slate-200 font-mono text-slate-800">
              {alert.explanation}
            </p>
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>Rule / Model Ref: <strong>{alert.ruleId}</strong></span>
            {alert.acknowledgedBy && (
              <span>Acknowledged by: <strong>{alert.acknowledgedBy}</strong></span>
            )}
          </div>
        </div>

        {/* Review Notes Log */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-teal-700" />
            Human Review Notes & Audit Log ({alert.reviewNotes?.length || 0})
          </h4>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {alert.reviewNotes?.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded border border-slate-200 text-center">
                No review notes recorded yet.
              </p>
            ) : (
              alert.reviewNotes.map((note, idx) => (
                <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded text-xs space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-800">
                    <span>{note.author}</span>
                    <span className="text-slate-400 font-mono font-normal">
                      {new Date(note.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-slate-600">{note.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
            <input
              type="text"
              placeholder="Type clinical review note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="clinical-input text-xs"
            />
            <Button type="submit" variant="secondary" size="sm" icon={Send}>
              Note
            </Button>
          </form>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2">
            {alert.status === 'NEW' && (
              <Button
                variant="primary"
                size="sm"
                icon={ShieldCheck}
                onClick={() => handleStatusChange('ACKNOWLEDGED')}
              >
                Acknowledge Alert
              </Button>
            )}
            {alert.status !== 'UNDER_REVIEW' && alert.status !== 'RESOLVED' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange('UNDER_REVIEW')}
              >
                Start Clinical Review
              </Button>
            )}
            {alert.status !== 'RESOLVED' && (
              <Button
                variant="success"
                size="sm"
                icon={CheckCircle}
                onClick={() => handleStatusChange('RESOLVED')}
              >
                Mark Resolved
              </Button>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
