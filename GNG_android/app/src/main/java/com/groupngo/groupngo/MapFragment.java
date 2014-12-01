package com.groupngo.groupngo;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONObject;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.google.android.gms.maps.CameraUpdate;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.groupngo.groupngo.dataService.DataService;


/**
 * A simple {@link Fragment} subclass.
 * Activities that contain this fragment must implement the
 * {@link MapFragment.OnFragmentInteractionListener} interface
 * to handle interaction events.
 * Use the {@link MapFragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class MapFragment extends android.support.v4.app.Fragment {

    public int fragmentType;

    private static final String SERVICE_BASE = "http://groupngo.website";
    static final LatLng HAMBURG = new LatLng(53.558, 9.927);
    static final LatLng KIEL = new LatLng(53.551, 9.993);
    private GoogleMap map;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    private OnFragmentInteractionListener mListener;

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment MapFragment.
     */
    // TODO: Rename and change types and number of parameters
    public static MapFragment newInstance(String param1, String param2) {
        MapFragment fragment = new MapFragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    public MapFragment() {
        // Required empty public constructor
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    private void setUpMapIfNeeded() {
        // Do a null check to confirm that we have not already instantiated the map.
        if (map == null)
            map = ((SupportMapFragment) getFragmentManager().findFragmentById(R.id.map)).getMap();
            // Check if we were successful in obtaining the map.
            if (map != null) {
                // The Map is verified. It is now safe to manipulate the map.
                //test markers
//                map = ((SupportMapFragment) getFragmentManager().findFragmentById(R.id.map)).getMap();

                CameraUpdate center = CameraUpdateFactory.newLatLng(new LatLng(33.777420, -84.397850));
                CameraUpdate zoom=CameraUpdateFactory.zoomTo(15);

                map.moveCamera(center);
                map.animateCamera(zoom);

                for (int i = 0; i < DataService.ITEMS.size(); i++){
                    Log.d("map", DataService.ITEMS.get(i).slocation);
                    map.addMarker(new MarkerOptions()
                            .position(DataService.ITEMS.get(i).sl)
                            .title(DataService.ITEMS.get(i).slocation));
                }
//                Log.d("map", "adding markers");
//                map.addMarker(new MarkerOptions()
//                        .position(HAMBURG)
//                        .title("Test1"));
//                map.addMarker(new MarkerOptions()
//                        .position(KIEL)
//                        .title("Test2"));
                //For starters, just show all start locations
//                ArrayList<String> names = new ArrayList<String>();
//                ArrayList<Double> coordinates = new ArrayList<Double>();
//
//                HttpClient httpclient = new DefaultHttpClient();
//                HttpResponse response;
//                String responseString = null;
//                String url = SERVICE_BASE + "/api/trips";
//
//                try {
//                    HttpGet request = new HttpGet(url);
//                    response = httpclient.execute(request);
//                    StatusLine statusline = response.getStatusLine();
//                    if(statusline.getStatusCode() == HttpStatus.SC_OK){
//                        ByteArrayOutputStream out = new ByteArrayOutputStream();
//                        response.getEntity().writeTo(out);
//                        out.close();
//                        responseString = out.toString();
//                        //We should have the response string now.
//                        //need to parse JSON
//                        //TODO: Is this supposed to be JSONArray or JSONObject?
//                        JSONArray jArray = new JSONArray(responseString);
//
//                        //parse through array of locations
//                        for(int i=0;i<jArray.length();i++){
//                            JSONObject jdata = jArray.getJSONObject(i);
//
//                            JSONObject slocation = jdata.getJSONObject("slocation");
//                            names.add(slocation.getString("name"));
//
//                            JSONObject coords = slocation.getJSONObject("coords");
//                            coordinates.add(coords.getDouble("latitude"));
//                            coordinates.add(coords.getDouble("longitude"));
//                        }
//
//                    } else{
//                        //Closes the connection.
//                        response.getEntity().getContent().close();
//                        throw new IOException(statusline.getReasonPhrase());
//                    }
//                } catch (ClientProtocolException e) {
//                } catch (IOException e) {
//                } catch (Exception e) {}
//
//
//                //we should have all starting locations, now make markers
//                for(int i=0;i<names.size();i++){
//                    Log.d("map", coordinates.get(i*2).toString() + ", " + coordinates.get((i*2)+1).toString());
//                    LatLng pos = new LatLng(coordinates.get(i*2), coordinates.get((i*2)+1));
//                    map.addMarker(new MarkerOptions()
//                            .position(pos)
//                            .title(names.get(i)));
//                }
            }

    }

    public void updateMarkers() {
        for (int i = 0; i < DataService.ITEMS.size(); i++){
            Log.d("map", DataService.ITEMS.get(i).slocation);
            map.addMarker(new MarkerOptions()
                    .position(DataService.ITEMS.get(i).sl)
                    .title(DataService.ITEMS.get(i).slocation));
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
//        return inflater.inflate(R.layout.fragment_map, container, false);

        View v = inflater.inflate(R.layout.fragment_map, container, false);

        SupportMapFragment mapFrag = (SupportMapFragment) getChildFragmentManager().findFragmentById(R.id.map);
        if (mapFrag != null) {
            map = mapFrag.getMap();
            setUpMapIfNeeded();

        }
        else
            Log.d("map", "no map found");


        return v;
    }

    // TODO: Rename method, update argument and hook method into UI event
    public void onButtonPressed(Uri uri) {
        if (mListener != null) {
            mListener.onFragmentInteraction(uri);
        }
    }

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        try {
            mListener = (OnFragmentInteractionListener) activity;
        } catch (ClassCastException e) {
            throw new ClassCastException(activity.toString()
                    + " must implement OnFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p/>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        public void onFragmentInteraction(Uri uri);
    }

}
