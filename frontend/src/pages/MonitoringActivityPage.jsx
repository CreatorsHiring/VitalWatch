import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { Play, Pause, Square, RotateCcw, Activity, Radio, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export function MonitoringActivityPage() {
  const {
    simStatus,
    simScenario,
    setSimScenario,
    simTargetId,
    setSimTargetId,
    simInterval,
    setSimInterval,
    simLogs,
    startSim,
    pauseSim,
    stopSim,
    resetDemo,
    patients,
  } = useApp();

  const targetPatient = patients.find((p) => p.id === simTargetId) || patients[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white rounded-lg p-5 border border-navy-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-400">
            <Radio className="w-4 h-4 text-teal-400 shrink-0 animate-pulse" />
            Software-Based Sensor Simulator & Telemetry Engine
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mt-1">
            Monitoring Activity & Simulation Control Panel
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Emulates bedside patient monitoring devices, streams synthetic vitals observations, and simulates technical failure scenarios without physical hardware.
          </p>
        </div>
        <Button variant="outline" size="sm" icon={RotateCcw} onClick={resetDemo}>
          Reset Demo State
        </Button>
      </div>

      {/* Main Grid: Control Panel + Live Telemetry Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Simulator Controls */}
        <div className="space-y-4">
          <Card title="Simulator Controls" subtitle="Select target patient, interval & demonstration scenario.">
            <div className="space-y-4">
              {/* Simulation Status Indicator */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Engine State:</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-bold font-mono ${
                  simStatus === 'RUNNING'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : simStatus === 'PAUSED'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-200 text-slate-700 border border-slate-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    simStatus === 'RUNNING' ? 'bg-emerald-600 animate-ping' : simStatus === 'PAUSED' ? 'bg-amber-600' : 'bg-slate-500'
                  }`} />
                  {simStatus}
                </span>
              </div>

              {/* Transport Buttons */}
              <div className="grid grid-cols-3 gap-2">
                {simStatus !== 'RUNNING' ? (
                  <Button variant="success" size="sm" icon={Play} onClick={startSim}>
                    Start
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" icon={Pause} onClick={pauseSim}>
                    Pause
                  </Button>
                )}

                <Button
                  variant="danger"
                  size="sm"
                  icon={Square}
                  disabled={simStatus === 'STOPPED'}
                  onClick={stopSim}
                >
                  Stop
                </Button>

                <Button variant="outline" size="sm" icon={RotateCcw} onClick={resetDemo}>
                  Reset
                </Button>
              </div>

              {/* Target Patient */}
              <Select
                label="Target Synthetic Patient"
                value={simTargetId}
                onChange={(e) => setSimTargetId(e.target.value)}
                options={patients.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.room})`,
                }))}
              />

              {/* Scenario Selection */}
              <Select
                label="Demonstration Scenario"
                value={simScenario}
                onChange={(e) => setSimScenario(e.target.value)}
                options={[
                  { value: 'NORMAL', label: '1. Normal Baseline (Stable Vitals)' },
                  { value: 'RAPID_CHANGE', label: '2. Configured Rapid Change (Tachycardia)' },
                  { value: 'MISSING_MEASUREMENT', label: '3. Missing Measurement (Gaps In Stream)' },
                  { value: 'POOR_SIGNAL', label: '4. Poor-Quality Signal (Artifact Flag)' },
                  { value: 'SENSOR_DISCONNECTED', label: '5. Sensor Disconnected (Feed Stopped)' },
                  { value: 'STALE_FEED', label: '6. Stale Feed (No Packets > 2 min)' },
                  { value: 'UNUSUAL_COMBINATION', label: '7. Unusual Combination (ML Anomaly)' },
                  { value: 'RECOVERY', label: '8. Stream Recovery (Restores Normal)' },
                ]}
              />

              {/* Interval Selection */}
              <Select
                label="Reporting Interval"
                value={simInterval.toString()}
                onChange={(e) => setSimInterval(Number(e.target.value))}
                options={[
                  { value: '1000', label: '1 second (High Frequency)' },
                  { value: '2000', label: '2 seconds (Standard Demo)' },
                  { value: '5000', label: '5 seconds' },
                  { value: '10000', label: '10 seconds' },
                ]}
              />
            </div>
          </Card>
        </div>

        {/* Right 2 Cols: Target Live Vitals Gauge & Stream Log */}
        <div className="lg:col-span-2 space-y-4">
          {/* Live Gauges for Target Patient */}
          <Card
            title={`Live Telemetry Stream: ${targetPatient.name}`}
            subtitle={`Device: ${targetPatient.deviceId} • ${targetPatient.ward} (${targetPatient.room})`}
            actions={<Badge severity={targetPatient.status}>{targetPatient.status.replace(/_/g, ' ')}</Badge>}
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Heart Rate</span>
                <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {targetPatient.vitals?.hr ?? '--'} <span className="text-xs font-normal text-slate-500">bpm</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">SpO₂ Oxygen</span>
                <p className="text-2xl font-bold font-mono text-blue-700 mt-1">
                  {targetPatient.vitals?.spo2 ?? '--'} <span className="text-xs font-normal text-slate-500">%</span>
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Blood Pressure</span>
                <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
                  {targetPatient.vitals?.sysBP ?? '--'}/{targetPatient.vitals?.diaBP ?? '--'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Signal Quality</span>
                <p className="text-xs font-bold font-mono text-teal-800 mt-2">
                  {targetPatient.vitals?.quality || 'VALID'}
                </p>
              </div>
            </div>
          </Card>

          {/* Real-time Event Log */}
          <Card title="Telemetry Stream Packet Audit Log" subtitle="Live observation payloads & simulator events.">
            <div className="bg-slate-950 text-slate-200 font-mono text-xs p-4 rounded-lg h-72 overflow-y-auto space-y-1.5 border border-slate-800 shadow-inner">
              {simLogs.map((log) => (
                <div key={log.id} className="leading-relaxed border-b border-slate-900/60 pb-1">
                  <span className="text-teal-400">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                  <span className="text-slate-300">{log.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
