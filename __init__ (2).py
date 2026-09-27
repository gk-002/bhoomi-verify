from app.states.base import StateAdapter, StateCapabilities
from app.states.registry import StateRegistry

from app.states.maharashtra import MaharashtraAdapter
from app.states.karnataka import KarnatakaAdapter
from app.states.gujarat import GujaratAdapter
from app.states.uttar_pradesh import UttarPradeshAdapter
from app.states.madhya_pradesh import MadhyaPradeshAdapter
from app.states.rajasthan import RajasthanAdapter
from app.states.tamil_nadu import TamilNaduAdapter
from app.states.telangana import TelanganaAdapter
from app.states.andhra_pradesh import AndhraPradeshAdapter
from app.states.west_bengal import WestBengalAdapter
from app.states.bihar import BiharAdapter
from app.states.punjab import PunjabAdapter
from app.states.haryana import HaryanaAdapter
from app.states.odisha import OdishaAdapter
from app.states.chhattisgarh import ChhattisgarhAdapter
from app.states.kerala import KeralaAdapter
from app.states.jharkhand import JharkhandAdapter
from app.states.assam import AssamAdapter
from app.states.himachal_pradesh import HimachalPradeshAdapter
from app.states.uttarakhand import UttarakhandAdapter
from app.states.goa import GoaAdapter
from app.states.tripura import TripuraAdapter
from app.states.manipur import ManipurAdapter
from app.states.meghalaya import MeghalayaAdapter
from app.states.mizoram import MizoramAdapter
from app.states.nagaland import NagalandAdapter
from app.states.arunachal_pradesh import ArunachalPradeshAdapter
from app.states.sikkim import SikkimAdapter


def register_all_states():
    """Initializes and registers all 28 official Indian State Land Record Adapters."""
    adapters = [
        MaharashtraAdapter(),
        KarnatakaAdapter(),
        GujaratAdapter(),
        UttarPradeshAdapter(),
        MadhyaPradeshAdapter(),
        RajasthanAdapter(),
        TamilNaduAdapter(),
        TelanganaAdapter(),
        AndhraPradeshAdapter(),
        WestBengalAdapter(),
        BiharAdapter(),
        PunjabAdapter(),
        HaryanaAdapter(),
        OdishaAdapter(),
        ChhattisgarhAdapter(),
        KeralaAdapter(),
        JharkhandAdapter(),
        AssamAdapter(),
        HimachalPradeshAdapter(),
        UttarakhandAdapter(),
        GoaAdapter(),
        TripuraAdapter(),
        ManipurAdapter(),
        MeghalayaAdapter(),
        MizoramAdapter(),
        NagalandAdapter(),
        ArunachalPradeshAdapter(),
        SikkimAdapter(),
    ]
    for adapter in adapters:
        StateRegistry.register(adapter)


# Auto-register on import
register_all_states()

__all__ = [
    "StateAdapter",
    "StateCapabilities",
    "StateRegistry",
    "register_all_states",
]
