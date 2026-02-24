-- Verification is tenant-centric: reports belong to bookings (tenant orders), not to the property.
-- Multiple tenants can verify the same property; "verified" is derived from existence of completed reports.

-- Allow multiple verification reports per property (one per tenant order)
ALTER TABLE "VerificationReport" DROP CONSTRAINT IF EXISTS "VerificationReport_propertyId_key";

CREATE INDEX IF NOT EXISTS "VerificationReport_propertyId_idx" ON "VerificationReport"("propertyId");

-- Remove property-level verified flag (landlord-agnostic; verified is derived for tenant discovery)
ALTER TABLE "Property" DROP COLUMN IF EXISTS "verified";
ALTER TABLE "Property" DROP COLUMN IF EXISTS "verificationReportId";
ALTER TABLE "Property" DROP COLUMN IF EXISTS "verificationDate";
