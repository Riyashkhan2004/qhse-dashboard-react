from apscheduler.schedulers.asyncio import AsyncIOScheduler

from utils import helpers

# TODO: Use Saudi Arabia timezone
scheduler = AsyncIOScheduler(timezone=helpers.ksa_tz)