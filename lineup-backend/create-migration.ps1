# Auto-confirm migration
$env:PRISMA_MIGRATE_SKIP_GENERATE = "false"
echo "y" | npx prisma migrate dev --name complete_schema
