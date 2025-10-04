import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function SampleDetails({ sample, onBack }) {
  if (!sample) return null;

  return (
    <Card className="bg-white/5 border border-border/40 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>Sample Report: {sample.sampleId}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 text-sm text-muted-foreground">
        {/* Location Details */}
        <section>
          <h4 className="font-semibold text-primary mb-2">📍 Location</h4>
          <p>
            <strong>State:</strong> {sample.state}
          </p>
          <p>
            <strong>District:</strong> {sample.district}
          </p>
          <p>
            <strong>Block:</strong> {sample.block}
          </p>
          <p>
            <strong>Village:</strong> {sample.village}
          </p>
          <p>
            <strong>Coordinates:</strong> {sample.latitude}, {sample.longitude}
          </p>
          <p>
            <strong>Geo Point:</strong> [
            {sample.location?.coordinates?.join(", ")}]
          </p>
        </section>

        {/* Water Quality */}
        <section>
          <h4 className="font-semibold text-primary mb-2">💧 Water Quality</h4>
          <p>
            <strong>pH:</strong> {sample.waterQuality?.pH}
          </p>
          <p>
            <strong>TDS:</strong> {sample.waterQuality?.tds}
          </p>
          <p>
            <strong>Hardness:</strong> {sample.waterQuality?.hardness}
          </p>
          <p>
            <strong>Fluoride:</strong> {sample.waterQuality?.fluoride}
          </p>
          <p>
            <strong>Nitrate:</strong> {sample.waterQuality?.nitrate}
          </p>
        </section>

        {/* Heavy Metals */}
        <section>
          <h4 className="font-semibold text-primary mb-2">🧪 Heavy Metals</h4>
          <p>
            <strong>Lead:</strong> {sample.metals?.lead}
          </p>
          <p>
            <strong>Uranium:</strong> {sample.metals?.uranimun}
          </p>
          <p>
            <strong>Arsenic:</strong> {sample.metals?.arsenic}
          </p>
          <p>
            <strong>Iron:</strong> {sample.metals?.iron}
          </p>
          <p>
            <strong>Mercury:</strong> {sample.metals?.mercury}
          </p>
          <p>
            <strong>Cadmium:</strong> {sample.metals?.cadmium}
          </p>
          <p>
            <strong>Chromium:</strong> {sample.metals?.chromium}
          </p>
        </section>

        {/* Indices */}
        <section>
          <h4 className="font-semibold text-primary mb-2">📊 Indices</h4>
          <p>
            <strong>HPI:</strong> {sample.indices?.hpi}
          </p>
          <p>
            <strong>MI:</strong> {sample.indices?.mi}
          </p>
          <p>
            <strong>CD:</strong> {sample.indices?.cd}
          </p>
          <p>
            <strong>Risk Level:</strong>
            <Badge variant={sample.category}>{sample.category}</Badge>
          </p>
        </section>

        {/* Sampling Details */}
        <section>
          <h4 className="font-semibold text-primary mb-2">🗓️ Sampling Info</h4>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(sample.samplingDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Well Type:</strong> {sample.wellType}
          </p>
        </section>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="mt-6 px-4 py-2 text-sm font-medium rounded-md bg-muted text-primary hover:bg-muted/80 transition"
        >
          ← Back to Results
        </button>
      </CardContent>
    </Card>
  );
}

export default SampleDetails;
